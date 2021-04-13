import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useDrag } from 'react-mc-dnd';

import { MOVABLE } from './utils/constants';

import { useStableRef } from './utils/hooks';

const Movable = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const {
    className,
    id,
    position,
    style: propsStyle,
    ...others
  } = props;

  const cls = classnames({
    'movable-render': true,
    [className]: !!className,
  });

  const style = useMemo(() => {
    if (!position) {
      return propsStyle;
    }

    const { left, top } = position;

    const transform = `translate(${left}px, ${top}px)`;

    return propsStyle
      ? { ...propsStyle, transform }
      : { transform };
  }, [position, propsStyle]);

  useDrag(ref, { id, type: MOVABLE });

  return (
    <div
      ref={ref}
      className={cls}
      style={style}
      {...others}
    />
  );
});

Movable.propTypes = {
  id: PropTypes.string,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

Movable.defaultProps = {
  id: '',
  position: undefined,
};

export default Movable;
