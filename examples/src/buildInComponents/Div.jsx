import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Div = React.forwardRef((props = {}, ref) => {
  const {
    className,
    children,
    ...others
  } = props;

  const cls = classnames({
    'build-components-div-render': true,
    [className]: !!className,
  });

  return (
    <div className={cls} ref={ref} {...others}>
      { children }
    </div>
  );
});

Div.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

Div.defaultProps = {
  children: 'Container',
  style: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 5,
    fontSize: 12,
    background: '#ddd',
    border: '1px solid white',
    borderRadius: 5,
  },
};

export default Div;
