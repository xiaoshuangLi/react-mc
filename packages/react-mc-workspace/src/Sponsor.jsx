import React, {
  useMemo,
  useState,
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

const Sponsor = React.forwardRef((props = {}, ref) => {
  const {
    className,
    onClick: propsOnClick,
    onChange: propsOnChange,
    children,
    ...others
  } = props;

  const cls = classnames({
    'workspace-sponsor': true,
    [className]: !!className,
  });

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
          <Selector onChange={onChange} {...others} />
        </div>
      </Mask>
    );
  };

  return (
    <>
      { renderContent() }
      { renderContainer() }
    </>
  );
});

export default Sponsor;
