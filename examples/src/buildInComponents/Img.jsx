import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const defaultStyle = {
  display: 'inline-block',
  width: '50%',
  height: 100,
  minWidth: '120px',
  border: '3px solid white',
  borderRadius: 5,
  boxShadow: '0 0 5px rgba(0,0,0, .1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxSizing: 'border-box',
};

const Img = React.forwardRef((props = {}, ref) => {
  const { className, style: propsStyle = {}, ...others } = props;

  const cls = classnames({
    'build-components-img-render': true,
    [className]: !!className,
  });

  const style = {
    ...defaultStyle,
    ...propsStyle,
  };

  return (
    <div ref={ref} className={cls} style={style} {...others} />
  );
});

Img.propTypes = {
  style: PropTypes.object,
};

Img.defaultProps = {
  style: defaultStyle,
};

export default Img;
