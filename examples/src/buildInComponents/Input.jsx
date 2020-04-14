import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const style = {
  display: 'block',
  width: '100%',
  height: '100%',
  border: 'none',
  backgroundColo: 'transparent',
};

const Input = React.forwardRef((props = {}, ref) => {
  const {
    className,
    value,
    placeholder,
    onChange,
    ...others
  } = props;

  const cls = classnames({
    'build-components-input-render': true,
    [className]: !!className,
  });

  return (
    <div className={cls} ref={ref} {...others}>
      <input
        type="text"
        value={value}
        style={style}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
});

Input.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  /**
   * @param value
   */
  onChange: PropTypes.func,
  style: PropTypes.object,
};

Input.defaultProps = {
  value: '',
  placeholder: 'Type when previewing',
  onChange: undefined,
  style: {
    padding: 5,
    fontSize: 12,
    border: '1px solid #eee',
    borderRadius: 5,
    backgroundColor: 'white',
  },
};

export default Input;
