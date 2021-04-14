import React, {
  useRef,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useDrop, useDrag } from 'react-mc-dnd';

import {
  DIRTY,
  DRAGGABLE,
} from './utils/constants';

import {
  DotsContext,
  useStableRef,
} from './utils/hooks';

const getElementRect = (element) => {
  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect() || {};
  const {
    top,
    left,
    bottom,
    right,
  } = rect;

  const centerTop = (top + bottom) / 2;
  const centerLeft = (left + right) / 2;

  return {
    top,
    left,
    bottom,
    right,
    centerTop,
    centerLeft,
  };
};

const rectToKey = (rect = {}) => {
  if (!rect) {
    return;
  }

  const values = Object.values(rect);

  return values.join('_');
};

const useDotsEffect = (ref, id) => {
  const [dots, setDots] = useContext(DotsContext);

  useEffect(() => {
    const found = dots.find(
      (item = {}) => item.id === id,
    );

    const rect = getElementRect(ref.current);
    const key = rectToKey(rect);

    const current = {
      id,
      ref,
      key,
      rect,
    };

    if (found) {
      const { key: foundKey } = found;
      const { key: currentKey } = current;

      if (foundKey === currentKey) {
        return;
      }

      setDots((prevDots = []) => {
        return prevDots.map((item) => {
          return item === found ? current : item;
        });
      });
    } else {
      setDots((prevDots = []) => {
        return prevDots.concat(current);
      });
    }
  });

  useEffect(() => {
    return () => setDots((prevDots = []) => {
      return prevDots.filter(
        (item = {}) => item.id !== id,
      );
    });
  }, [id, setDots]);
};

const DirtyDot = React.forwardRef((props = {}, ref) => {
  const { className, children, ...others } = props;

  const cls = classnames({
    'dirty-dot': true,
    [className]: !!className,
  });

  return (
    <div ref={ref} className={cls} {...others} />
  );
});

const DraggableDot = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const { className, children, ...others } = props;
  const { id } = others;

  const cls = classnames({
    'draggable-dot': true,
    [className]: !!className,
  });

  const area = useRef(null);

  useDrop(ref, { parentData: { id } });
  useDrag(area, {
    dotId: id,
    type: DIRTY,
    id: `${id}_${DIRTY}`,
  });

  return (
    <div ref={ref} className={cls} {...others}>
      <div className="dot-area" ref={area} />
      { children }
    </div>
  );
});

const Dot = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const { type, className, ...others } = props;
  const { id } = others;

  const cls = classnames({
    'dot-render': true,
    [className]: !!className,
  });

  const ComponentClass = useMemo(() => {
    switch (type) {
      case DIRTY:
        return DirtyDot;
      default:
        return DraggableDot;
    }
  }, [type]);

  useDotsEffect(ref, id);

  return (
    <ComponentClass ref={ref} className={cls} {...others} />
  );
});

Dot.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf([DIRTY, DRAGGABLE]),
};

Dot.defaultProps = {
  id: '',
  type: DRAGGABLE,
};

export default Dot;
