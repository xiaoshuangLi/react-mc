import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Sponsor from './Sponsor';

const Creator = React.forwardRef((props = {}, ref) => {
  const {
    className,
    placeholder = '',
    onCreate: propsOnCreate,
    ...others
  } = props;

  const cls = classnames({
    'workspace-creator': true,
    [className]: !!className,
  });

  return (
    <Sponsor
      ref={ref}
      className={cls}
      onChange={propsOnCreate}
      {...others}
    >
      <div className="icon" />
      <div className="placeholder">{ placeholder }</div>
    </Sponsor>
  );
});

Creator.propTypes = {
  placeholder: PropTypes.string,
  onCreate: PropTypes.func,
};

Creator.defaultProps = {
  placeholder: '',
  onCreate: undefined,
};

export default Creator;
