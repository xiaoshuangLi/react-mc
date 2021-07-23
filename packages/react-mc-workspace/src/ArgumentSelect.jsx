import React, {
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import { useArgument, useMode } from './utils/hooks';

import Mask from './Mask';

const useCurrent = (props = {}) => {
  const { options, value } = props;

  return useMemo(() => {
    if (!options) {
      return;
    }

    return options.find(
      (item = {}) => item.value === value,
    );
  }, [options, value]);
};

// TODO: 选项过滤
// TODO: 选项弹出位置
const ArgumentSelect = React.forwardRef((props = {}, ref) => {
  const {
    className,
    placeholder,
    options = [],
    value: propsValue,
    onClick: propsOnClick,
    onChange: propsOnChange,
    ...others
  } = props;

  const mode = useMode();
  const current = useCurrent(props);

  const cls = useMemo(() => {
    const componentClassName = mode
      ? `workspace-argument-select-for-${mode}`
      : 'workspace-argument-select';

    return classnames({
      [className]: !!className,
      [componentClassName]: !!componentClassName,
      'workspace-argument-placeholder': !current,
    });
  }, [className, mode, current]);

  const [visible, setVisible] = useState(false);

  const onClick = useEventCallback((...args) => {
    const [e] = args;

    setVisible(true);

    e.stopPropagation();
    propsOnClick && propsOnClick(...args);
  });

  const onClickMask = useEventCallback((e) => {
    setVisible(false);
    e.stopPropagation();
  });

  const renderContent = () => {
    return current
      ? current.label
      : placeholder;
  };

  const renderOptions = () => {
    if (!visible) {
      return null;
    }

    if (!options.length) {
      return null;
    }

    if (!propsOnChange) {
      return null;
    }

    const items = options.map((item = {}, index) => {
      const { label, value } = item;

      const itemCls = classnames({
        'options-item': true,
        'item-active': value === propsValue,
      });

      const onClickItem = (e) => {
        e.stopPropagation();

        setVisible(false);
        propsOnChange && propsOnChange(value);
      };

      return (
        <div key={index} className={itemCls} onClick={onClickItem}>
          { label }
        </div>
      );
    });

    return (
      <>
        <Mask background="transparent" onClick={onClickMask} />
        <div className="select-options">
          { items }
        </div>
      </>
    );
  };

  useArgument(props);

  return (
    <span ref={ref} className={cls} onClick={onClick} {...others}>
      { renderContent() }
      { renderOptions() }
    </span>
  );
});

ArgumentSelect.propTypes = {
  placeholder: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any,
    }),
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
};

ArgumentSelect.defaultProps = {
  placeholder: '',
  options: [],
  value: '',
  onChange: undefined,
};

export default ArgumentSelect;
