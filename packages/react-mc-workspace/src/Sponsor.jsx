import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import { StateContext } from './utils/hooks';

import Mask from './Mask';
import Selector from './Selector';

const properties = [
  '--workspace-theme-color-r',
  '--workspace-theme-color-g',
  '--workspace-theme-color-b',
  '--workspace-theme-color',
  '--workspace-theme-color-light',
  '--workspace-theme-color-lighter',
];

const definitionToCreation = (definition = {}) => {
  const { type, value } = definition;

  return value === undefined
    ? { type }
    : { type, value };
};

const Sponsor = React.forwardRef((props = {}, ref) => {
  const {
    className,
    onClick: propsOnClick,
    onChange: propsOnChange,
    children,
    ...others
  } = props;
  const { output } = others;

  const cls = classnames({
    'workspace-sponsor': true,
    [className]: !!className,
  });

  const selectorRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [state = {}] = useContext(StateContext);
  const { root } = state;

  const style = useMemo(() => {
    if (!visible) {
      return;
    }

    if (!root) {
      return;
    }

    const { current } = root;

    if (!current) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const computedStyle = window.getComputedStyle(current);

    return properties.reduce((res = {}, property) => {
      const value = computedStyle.getPropertyValue(property);

      return value
        ? { ...res, [property]: value }
        : res;
    }, {});
  }, [visible, root]);

  const onChange = useEventCallback((...args) => {
    setVisible(false);
    propsOnChange && propsOnChange(...args);
  });

  const onClick = useEventCallback((...args) => {
    const [e] = args;

    setVisible(true);

    e.stopPropagation();
    propsOnClick && propsOnClick(...args);
  });

  const onClickMask = useEventCallback(() => {
    setVisible(false);
  });

  const onRenderSelector = useEventCallback(() => {
    if (!visible) {
      return;
    }

    if (output) {
      return;
    }

    const { current } = selectorRef;

    if (!current) {
      return;
    }

    const { getCollections } = current;

    if (!getCollections) {
      return;
    }

    const collections = getCollections() || [];
    const definitions = collections.reduce((res = [], collection = {}) => {
      const { definitions: collectionDefinitions = [] } = collection;

      return res.concat(collectionDefinitions);
    }, []);

    if (definitions.length !== 1) {
      return;
    }

    const [definition] = definitions;
    const creation = definitionToCreation(definition);

    onChange(creation);
  });

  const renderContent = () => {
    return (
      <span ref={ref} className={cls} onClick={onClick}>
        { children }
      </span>
    );
  };

  const renderContainer = () => {
    if (!visible) {
      return null;
    }

    return (
      <Mask onClick={onClickMask}>
        <div className="react-mc-workspace-sponsor-container" style={style}>
          <Selector ref={selectorRef} onChange={onChange} {...others} />
        </div>
      </Mask>
    );
  };

  useEffect(
    () => onRenderSelector(),
    [visible, onRenderSelector],
  );

  return (
    <>
      { renderContent() }
      { renderContainer() }
    </>
  );
});

export default Sponsor;
