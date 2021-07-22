import React, {
  useMemo,
  useState,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

const container = (() => {
  if (typeof document === 'undefined') {
    return;
  }

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  return dom;
})();

const Mask = React.forwardRef((props = {}, ref) => {
  const {
    className,
    background,
    style: propsStyle,
    onClick: propsOnClick,
    children,
    ...others
  } = props;

  const cls = classnames({
    'workspace-mask': true,
    [className]: !!className,
  });

  const [visible, setVisible] = useState(true);

  const style = useMemo(() => {
    if (!background) {
      return propsStyle;
    }

    return propsStyle
      ? { ...propsStyle, background }
      : { background };
  }, [propsStyle, background]);

  const onClick = useEventCallback((...args) => {
    setVisible(false);
    propsOnClick && propsOnClick(...args);
  });

  const onKeyDown = useEventCallback((...args) => {
    const [e = {}] = args;
    const { which } = e;

    if (!visible) {
      return;
    }

    if (which !== 27) {
      return;
    }

    onClick(e, ...args);
  });

  const maskNode = (
    <div
      ref={ref}
      className={cls}
      style={style}
      onClick={onClick}
      {...others}
    />
  );

  const element = (
    <>
      { maskNode }
      { children }
    </>
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    document.addEventListener('keydown', onKeyDown);
    () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, onKeyDown]);

  if (!visible) {
    return null;
  }

  return createPortal(element, container);
});

Mask.propTypes = {
  background: PropTypes.string,
};

Mask.defaultProps = {
  background: 'rgba(0, 0, 0, .3)',
};

export default Mask;
