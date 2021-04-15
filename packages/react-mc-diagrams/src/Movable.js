import React, {
  memo,
  useMemo,
  Children,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useDrag } from 'react-mc-dnd';

import { MOVABLE } from './utils/constants';

import { useStableRef } from './utils/hooks';

const Movable = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const {
    className,
    position,
    style: propsStyle,
    ...others
  } = props;
  const { id } = others;

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
  id: PropTypes.string.isRequired,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

Movable.defaultProps = {
  position: undefined,
};

const isSameProps = (prevProps = {}, nextProps = {}) => {
  const { children: prevChildren, ...prevOthers } = prevProps;
  const { children: nextChildren, ...nextOthers } = nextProps;

  const prevEntries = Object.entries(prevOthers);
  const nextEntries = Object.entries(nextOthers);

  if (prevEntries.length !== nextEntries.length) {
    return false;
  }

  const different = prevEntries.some((prevEntry) => {
    const [key, prevValue] = prevEntry;
    const { [key]: nextValue } = nextOthers;

    return prevValue !== nextValue;
  });

  if (different) {
    return false;
  }

  // eslint-disable-next-line
  return isSameChildren(prevChildren, nextChildren);
};

const isSameChildren = (prevChildren, nextChildren) => {
  const prevArray = Children.toArray(prevChildren);
  const nextArray = Children.toArray(nextChildren);

  if (prevArray.length !== nextArray.length) {
    return false;
  }

  return prevArray.every((prevChild, index) => {
    const nextChild = nextArray[index];

    if (prevChild === nextChild) {
      return true;
    }

    const prevType = typeof prevChild;
    const nextType = typeof nextChild;

    // return for not object
    if (prevType !== nextType) {
      return false;
    }

    // return for null
    if (!prevChild || !nextChild) {
      return false;
    }

    const {
      key: prevChildKey,
      ref: prevChildRef,
      type: prevChildType,
      props: prevChildProps,
    } = prevChild;

    const {
      key: nextChildKey,
      ref: nextChildRef,
      type: nextChildType,
      props: nextChildProps,
    } = nextChild;

    if (prevChildKey !== nextChildKey) {
      return false;
    }

    if (prevChildRef !== nextChildRef) {
      return false;
    }

    if (prevChildType !== nextChildType) {
      return false;
    }

    return isSameProps(prevChildProps, nextChildProps);
  });
};

export default memo(Movable, isSameProps);
