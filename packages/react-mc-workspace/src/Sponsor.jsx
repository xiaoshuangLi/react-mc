import React, { useState } from 'react';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import Mask from './Mask';
import Selector from './Selector';

const Sponsor = React.forwardRef((props = {}, ref) => {
  const {
    className,
    onClick: propsOnClick,
    onChange: propsOnChange,
    children,
    ...others
  } = props;

  const cls = classnames({
    'workspace-sponsor': true,
    [className]: !!className,
  });

  const [visible, setVisible] = useState(false);

  const onChange = useEventCallback((...args) => {
    setVisible(false);
    propsOnChange && propsOnChange(...args);
  });

  const onClick = useEventCallback((...args) => {
    propsOnClick && propsOnClick(...args);
    setVisible(true);
  });

  const onClickMask = useEventCallback(() => {
    setVisible(false);
  });

  const renderContent = () => {
    return (
      <span ref={ref} className={cls} onClick={onClick}>
        { children }
      </span>
    );
  };

  const renderContainer = () => {
    if (!visible) {
      return null;
    }

    return (
      <Mask onClick={onClickMask}>
        <div className="react-mc-workspace-sponsor-container">
          <Selector onChange={onChange} {...others} />
        </div>
      </Mask>
    );
  };

  return (
    <>
      { renderContent() }
      { renderContainer() }
    </>
  );
});

export default Sponsor;
