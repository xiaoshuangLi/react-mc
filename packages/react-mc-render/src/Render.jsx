import React, {
  useMemo,
  useEffect,
  useContext,
  createRef,
} from 'react';
import classnames from 'classnames';

import { getValueByKeys, setValueByKeys } from 'shared/utils';
import { findRelationKeysGroup } from 'shared/relation';

import {
  RenderContext,
  renderByMemo,
  useOptionsFromProps,
  useOptionsFromContext,
  useGetDependencies,
} from './utils/hooks';
import defaultOptions from './utils/options';

import PropTypes from './PropTypes';

const { Provider: RenderProvider } = RenderContext;

/**
 * const {
 *   options = {
 *     getComponentClass = (component = {}) => 'div',
 *     getComponentRenderDependencies = (...args) => args,
 *     render: (ComponentClass = 'div', component = {}) => (props, ref) => {
 *       return (<ComponentClass ref={ref} {...props} />);
 *     },
 *   },
 *   value = {
 *     rootComponentIds: [],
 *     componentMap: {},
 *     relationMap: {},
 *   },
 *   componentId,
 * } = props;
 */
const ComponentRender = React.forwardRef((props = {}, ref) => {
  ref = useMemo(() => {
    return ref || createRef();
  }, [ref]);

  const { className, componentId, value = {} } = props;
  const { componentMap = {}, relationMap = {} } = value;

  const options = useOptionsFromProps(props);
  const { getComponentClass, render } = options;

  const relation = relationMap[componentId] || {};
  const component = componentMap[componentId] || {};
  const { props: baseComponentProps = {} } = component;

  const ComponentClass = getComponentClass(component);

  const keysGroup = findRelationKeysGroup(relation) || [];
  const componentProps = keysGroup.reduce((res = {}, keys = []) => {
    const componentIds = getValueByKeys(relation, keys) || [];

    if (componentIds.length) {
      res = setValueByKeys(res, keys, (
        <ComponentsRender componentIds={componentIds} />
      ));
    }

    return res;
  }, baseComponentProps);

  const cls = classnames({
    'component-render': true,
    [className]: !!className,
  });

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

/**
 * const {
 *   options = {
 *     getComponentClass = () => 'div',
 *     getComponentRenderDependencies = (...args) => args,
 *     render: (ComponentClass = 'div', component = {}) => (props, ref) => {
 *       return (<ComponentClass ref={ref} {...props} />);
 *     },
 *   },
 *   value = {
 *     rootComponentIds: [],
 *     componentMap: {},
 *     relationMap: {},
 *   },
 *   componentIds = [],
 * } = props;
 */
const ComponentsRender = (props = {}) => {
  const { componentIds = [] } = props;

  const context = useContext(RenderContext);
  const options = useOptionsFromContext();

  const getDependencies = useGetDependencies(options);
  const ComponentClass = useMemo(
    () => renderByMemo(ComponentRender, getDependencies),
    [getDependencies],
  );

  return componentIds.map((componentId) => (
    <ComponentClass
      key={componentId}
      componentId={componentId}
      {...context}
    />
  ));
};

const Render = (props = {}) => {
  const { value = {} } = props;
  const { rootComponentIds = [] } = value;

  useEffect(() => {
    const listener = () => {};

    document.addEventListener('touchstart', listener);
    return () => document.removeEventListener('touchstart', listener);
  }, []);

  return (
    <RenderProvider value={props}>
      <ComponentsRender componentIds={rootComponentIds} />
    </RenderProvider>
  );
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
