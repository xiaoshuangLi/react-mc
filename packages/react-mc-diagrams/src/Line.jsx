import React, {
  memo,
  useRef,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import { DotsContext } from './utils/hooks';

const LENGTH = 80;

const useElementRect = (id) => {
  const [dots = []] = useContext(DotsContext);

  return useMemo(() => {
    if (!id) {
      return;
    }

    const dot = dots.find(
      (item = {}) => item.id === id,
    );

    if (!dot) {
      return;
    }

    return dot.rect;
  }, [id, dots]);
};

const useD = (props = {}) => {
  const {
    offset,
    sourceElementRect,
    targetElementRect,
  } = props;

  return useMemo(() => {
    if (!sourceElementRect || !targetElementRect) {
      return '';
    }

    const { centerLeft: sourceCenterLeft, centerTop: sourceCenterTop } = sourceElementRect;
    const { centerLeft: targetCenterLeft, centerTop: targetCenterTop } = targetElementRect;

    const a = targetCenterTop - sourceCenterTop;
    const k = (targetCenterLeft - sourceCenterLeft) / a;

    // eslint-disable-next-line
    const h = 0.5 * (sourceCenterTop ** 2 + sourceCenterLeft ** 2 - targetCenterLeft ** 2 - targetCenterTop ** 2) / a;

    let offsetCenterLeft;
    let offsetCenterTop;

    if (Math.abs(k) > 1) {
      const ratio = sourceCenterLeft < targetCenterLeft ? 1 : -1;
      const standardCenterLeft = 0.5 * (sourceCenterLeft + targetCenterLeft);
      const centerTop = -0.5 * (sourceCenterTop + targetCenterTop);
      const y = centerTop + offset * LENGTH * ratio;

      offsetCenterTop = -y;
      offsetCenterLeft = (y - h) / k;
      offsetCenterLeft = Number.isNaN(offsetCenterLeft)
        ? standardCenterLeft
        : offsetCenterLeft;
    } else {
      const ratio = sourceCenterTop < targetCenterTop ? 1 : -1;
      const centerLeft = 0.5 * (sourceCenterLeft + targetCenterLeft);

      offsetCenterLeft = centerLeft + offset * LENGTH * ratio;
      offsetCenterTop = -1 * (k * offsetCenterLeft + h);
    }

    const start = `${Math.round(sourceCenterLeft)} ${Math.round(sourceCenterTop)}`;
    const center = `${Math.round(offsetCenterLeft)} ${Math.round(offsetCenterTop)}`;
    const end = `${Math.round(targetCenterLeft)} ${Math.round(targetCenterTop)}`;

    if (center.includes('NaN')) {
      return `M ${start} Q ${end}, ${end}`;
    }

    return `M ${start} Q ${center}, ${end}`;
  }, [offset, sourceElementRect, targetElementRect]);
};

let svg;

const useCalculate = (d) => {
  const element = useRef(null);

  useEffect(() => () => {
    const { current } = element;

    current && current.remove();
  }, [element]);

  useMemo(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (!d) {
      return;
    }

    if (!svg) {
      svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );

      svg.setAttribute('class', 'diagrams-inivisible-path');
    }

    if (element.current) {
      const attribute = element.current.getAttribute('d');

      attribute !== d && element.current.setAttribute('d', d);
    } else {
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      );

      path.setAttribute('d', d);
      svg.appendChild(path);
      document.body.appendChild(svg);

      element.current = svg.querySelector('path');
    }

    return element.current;
  }, [d]);

  const getLength = useEventCallback((num = 0) => {
    const type = typeof num;
    const total = element.current.getTotalLength();

    switch (type) {
      case 'number':
        return num > 0
          ? num
          : total - num;
      case 'string': {
        const isPercent = num.endsWith('%');

        let length;

        if (isPercent) {
          const str = num.replace('%', '');
          const percent = Number(str);

          length = total * percent;
          length /= 100;
        } else {
          length = Number(num);
        }

        return Number.isNaN(length) ? 0 : length;
      }
      default:
        return 0;
    }
  });

  return useEventCallback((num) => {
    const { current } = element;

    if (!current) {
      return;
    }

    const length = getLength(num);
    const total = getLength('100%');

    const start = current.getPointAtLength(0);
    const end = current.getPointAtLength(total);
    const point = current.getPointAtLength(length);

    const reverse = end.x - start.x < 0;

    let prevPointLength = reverse ? length + 1 : length - 1;
    prevPointLength = Math.min(total - 1, prevPointLength);
    prevPointLength = Math.max(1, prevPointLength);

    const prevPonint = current.getPointAtLength(prevPointLength);

    const height = point.y - prevPonint.y;
    const width = point.x - prevPonint.x;
    const tan = height / width;

    let deg;

    if (Number.isNaN(tan)) {
      deg = 90;
    } else {
      const turn = Math.atan(tan) / Math.PI;
      deg = 180 * turn;
    }

    const angle = reverse
      ? 180 + deg
      : deg;

    return { point, angle };
  });
};

const Draw = React.forwardRef((props = {}, ref) => {
  const {
    className,
    active,
    offset,
    sourceElementRect,
    targetElementRect,
    arrows = [],
    children,
    ...others
  } = props;

  const cls = classnames({
    'line-render': true,
    'line-active': !!active,
    [className]: !!className,
  });

  const d = useD(props);
  const calculate = useCalculate(d);

  const path = useMemo(() => {
    if (!d) {
      return null;
    }

    const polygons = arrows.map((length, index) => {
      const calculation = calculate(length);

      if (!calculation) {
        return null;
      }

      const { point = {}, angle } = calculation;
      const rotate = `rotate(${angle})`;
      const translate = `translate(${point.x} ${point.y})`;

      return (
        <g transform={translate} key={index}>
          <polygon className="line-arrow" points="-4,3.5 -4,-3.5 6,0" transform={rotate} />
        </g>
      );
    });

    return (
      <svg className="line-svg">
        <path fill="transparent" className="line-path" d={d} />
        <path fill="transparent" className="line-area" d={d} />
        { polygons }
      </svg>
    );
  }, [d, calculate]);

  const content = useMemo(() => {
    if (!d) {
      return null;
    }

    if (!children) {
      return null;
    }

    const calculation = calculate('50%');

    if (!calculation) {
      return null;
    }

    const { point: { x, y } = {} } = calculation;

    const transform = `translate(${x}px, ${y}px)`;
    const style = { transform };

    return (
      <div className="line-container" style={style}>
        <div className="content">
          { children }
        </div>
      </div>
    );
  }, [d, calculate, children]);

  return (
    <div ref={ref} className={cls} {...others}>
      { path }
      { content }
    </div>
  );
});

const MemoDraw = memo(Draw);

const Line = React.forwardRef((props = {}, ref) => {
  const {
    source,
    target,
    onClick: propsOnClick,
    onDoubleClick: propsOnDoubleClick,
    ...others
  } = props;

  const sourceElementRect = useElementRect(source);
  const targetElementRect = useElementRect(target);

  const onClick = useEventCallback((...args) => {
    propsOnClick && propsOnClick(...args);
  });

  const onDoubleClick = useEventCallback((...args) => {
    propsOnDoubleClick && propsOnDoubleClick(...args);
  });

  return (
    <MemoDraw
      ref={ref}
      sourceElementRect={sourceElementRect}
      targetElementRect={targetElementRect}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      {...others}
    />
  );
});

Line.propTypes = {
  active: PropTypes.bool,
  offset: PropTypes.number,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  arrows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  ),
};

Line.defaultProps = {
  active: false,
  offset: 0,
  arrows: [],
};

export default Line;
