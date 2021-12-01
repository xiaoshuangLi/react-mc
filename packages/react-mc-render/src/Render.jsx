import React, {
  memo,
  useRef,
  useMemo,
  useState,
  useEffect,
  createRef,
} from 'react';
import classnames from 'classnames';

import { isSame } from 'shared/array';
import { findRelationKeysGroup } from 'shared/relation';
import { getValueByKeys, setValueByKeys } from 'shared/utils';
import { useEventCallback } from 'shared/hooks';

import defaultOptions from './utils/options';
import { useOptions } from './utils/hooks';
import { traverse } from './utils';

import PropTypes from './PropTypes';

const ComponentRender = React.forwardRef((props = {}, ref) => {
  ref = useMemo(() => {
    return ref || createRef();
  }, [ref]);

  const { className, componentId, ...others } = props;
  const { subscribe, usingContext } = others;

  const context = usingContext() || {};
  const { value = {} } = context;
  const { componentMap = {}, relationMap = {} } = value;

  const options = useOptions(context);
  const { getComponentClass, render } = options;

  const relation = relationMap[componentId] || {};
  const component = componentMap[componentId] || {};
  const { props: baseComponentProps = {} } = component;

  const ComponentClass = getComponentClass(component);

  const keysGroup = findRelationKeysGroup(relation) || [];
  const componentProps = keysGroup.reduce((res = {}, keys = []) => {
    const componentIds = getValueByKeys(relation, keys) || [];

    if (componentIds.length) {
      const node = componentIds.map((currentComponentId) => (
        <MemoComponentRender
          key={currentComponentId}
          componentId={currentComponentId}
          {...others}
        />
      ));

      res = setValueByKeys(res, keys, node);
    }

    return res;
  }, baseComponentProps);

  const cls = classnames({
    'component-render': true,
    [className]: !!className,
  });

  const [, setState] = useState({});

  useEffect(() => {
    const forceUpdate = () => setState({});

    return subscribe
      ? subscribe(componentId, forceUpdate)
      : undefined;
  }, [componentId, subscribe]);

  if (!componentId) {
    return null;
  }

  if (!ComponentClass) {
    return null;
  }

  return render(ComponentClass, component)(
    {
      className: cls,
      id: componentId,
      ...componentProps,
    },
    ref,
  );
});

const MemoComponentRender = memo(
  ComponentRender,
  () => true,
);

const Render = (props = {}) => {
  const { value = {} } = props;
  const {
    relationMap = {},
    componentMap = {},
    rootComponentIds = [],
  } = value;

  const listenersRef = useRef({});
  const dependenciesRef = useRef({});
  const options = useOptions(props);

  const {
    getComponentClass,
    getComponentRenderDependencies,
  } = options;

  const subscribe = useEventCallback((componentId, listener) => {
    const { current = {} } = listenersRef;
    const { [componentId]: listeners = [] } = current;

    current[componentId] = listeners.concat(listener);

    return () => {
      const { [componentId]: prevListeners = [] } = current;

      const nextListeners = prevListeners.filter(
        (prevListener) => prevListener !== listener,
      );

      if (nextListeners.length) {
        current[componentId] = nextListeners;
      } else {
        delete current[componentId];
      }
    };
  });

  const usingContext = useEventCallback(() => props);

  const getDependencies = useEventCallback((componentId) => {
    const relation = relationMap[componentId];
    const component = componentMap[componentId];

    const ComponentClass = getComponentClass(component);
    const rest = getComponentRenderDependencies(component) || [];

    return [relation, component, ComponentClass, ...rest];
  });

  const { current: listenersMap = {} } = listenersRef;
  const { current: dependenciesMap = {} } = dependenciesRef;

  useMemo(() => {
    traverse(value, (componentId) => {
      const prevDependencies = dependenciesMap[componentId];
      const nextDependencies = getDependencies(componentId) || [];

      const same = prevDependencies === undefined
        ? false
        : isSame(prevDependencies, nextDependencies);

      if (same) {
        return;
      }

      const listeners = listenersMap[componentId] || [];
      const shouldRender = prevDependencies !== undefined && listeners.length;

      dependenciesMap[componentId] = nextDependencies;
      shouldRender && listeners.forEach(
        (listener) => listener && listener(),
      );
    });
  });

  useEffect(() => {
    const listener = () => {};

    document.addEventListener('touchstart', listener);
    return () => document.removeEventListener('touchstart', listener);
  }, []);

  return rootComponentIds.map((rootComponentId) => (
    <MemoComponentRender
      key={rootComponentId}
      componentId={rootComponentId}
      subscribe={subscribe}
      usingContext={usingContext}
      {...props}
    />
  ));
};

Render.propTypes = PropTypes;

Render.defaultProps = {
  options: defaultOptions,
  value: {
    rootComponentIds: [],
    componentMap: {},
    relationMap: {},
  },
};

export default Render;
