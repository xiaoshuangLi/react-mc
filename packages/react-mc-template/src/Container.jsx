import React from 'react';
import classnames from 'classnames';

import { withDrop } from 'react-mc-dnd';

const Container = React.forwardRef((props = {}, ref) => {
  const { className, style: propsStyle = {}, ...others } = props;

  const cls = classnames({
    'react-mc-template-container-render': true,
    [className]: !!className,
  });

  const style = {
    outline: 'none',
    ...propsStyle,
  };

  return (
    <div
      ref={ref}
      className={cls}
      style={style}
      {...others}
    />
  );
});

export default withDrop(Container);
