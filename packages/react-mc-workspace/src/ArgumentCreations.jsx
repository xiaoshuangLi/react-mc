import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useArgument } from './utils/hooks';

import Creations from './Creations';

const ArgumentCreations = React.forwardRef((props = {}, ref) => {
  const { className, ...others } = props;

  const cls = classnames({
    'workspace-argument-creations': true,
    'workspace-decoration-for-compact': true,
    [className]: !!className,
  });

  useArgument(props);

  return (
    <Creations ref={ref} className={cls} {...others} />
  );
});

ArgumentCreations.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.object,
  ),
  onChange: PropTypes.func,
};

ArgumentCreations.defaultProps = {
  value: [],
  onChange: undefined,
};

export default ArgumentCreations;
