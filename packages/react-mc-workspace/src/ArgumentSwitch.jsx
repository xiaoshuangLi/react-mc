import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import { useArgument, useMode } from './utils/hooks';

import Space from './Space';

const ArgumentSwitch = React.forwardRef((props = {}, ref) => {
  const {
    className,
    value: propsValue,
    onClick: propsOnClick,
    onChange: propsOnChange,
    ...others
  } = props;

  const mode = useMode();

  const cls = classnames({
    'workspace-argument-switch': true,
    'switch-active': !!propsValue,
    [className]: !!className,
  });

  const onClick = useEventCallback((...args) => {
    const [e] = args;

    propsOnChange && e.stopPropagation();
    propsOnClick && propsOnClick(...args);
    propsOnChange && propsOnChange(!propsValue);
  });

  useArgument(props);

  if (mode) {
    return null;
  }

  return (
    <Space>
      <div ref={ref} className={cls} onClick={onClick} {...others}>
        <div className="content">
          <div className="dot" />
        </div>
      </div>
    </Space>
  );
});

ArgumentSwitch.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

ArgumentSwitch.defaultProps = {
  value: false,
  onChange: undefined,
};

export default ArgumentSwitch;
