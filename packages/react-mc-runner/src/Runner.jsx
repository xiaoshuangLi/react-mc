import React, { memo } from 'react';

import Render from 'react-mc-render';

import defaultOptions from './utils/options';
import { useOptions } from './utils/hooks';

import PropTypes from './PropTypes';

const Runner = React.forwardRef((props = {}, ref) => {
  const {
    value,
    options: propsOptions,
    onChange,
    ...others
  } = props;


  const options = useOptions(props);

  return (
    <Render
      ref={ref}
      value={value}
      options={options}
      {...others}
    />
  );
});

Runner.propTypes = PropTypes;

Runner.defaultProps = {
  options: defaultOptions,
  value: {
    rootComponentIds: [],
    componentMap: {},
    relationMap: {},
  },
  onChange: undefined,
};

export default memo(Runner);
