import throttle from 'lodash/throttle';

const loop = (fn, time = 100) => {
  if (!fn) {
    return () => {};
  }

  let timer;

  const run = () => {
    fn();
    timer = setTimeout(run, time);
  };

  run();
  return () => clearTimeout(timer);
};

const getParentElements = (dom) => {
  if (!dom) {
    return [];
  }

  const { parentElement, tagName } = dom;
  const parentElements = getParentElements(parentElement) || [];

  if (tagName === 'BODY') {
    return [];
  }

  if (!parentElement) {
    return [];
  }

  return parentElements.concat(parentElement);
};

const hasScroll = (dom) => {
  const {
    clientWidth,
    clientHeight,
    scrollWidth,
    scrollHeight,
  } = dom;

  return clientWidth !== scrollWidth || clientHeight !== scrollHeight;
};

const rectToStyle = (rect = {}) => {
  const {
    width,
    height,
    left,
    top,
  } = rect;

  const borderWidth = 1;

  return {
    position: 'fixed',
    top: '0px',
    left: '0px',
    transition: '.15s',
    width: `${width - borderWidth * 2}px`,
    height: `${height - borderWidth * 2}px`,
    opacity: width * height ? 1 : 0,
    transform: `translate(${left}px, ${top}px)`,
    border: `${borderWidth}px solid #1890ff`,
    'border-radius': '2px',
    'pointer-events': 'none',
    'z-index': 99999999999,
  };
};

const calcRect = (root = document.body) => (dom) => {
  const rootRect = root.getBoundingClientRect();
  const { scrollTop, scrollLeft } = root;
  const { top: rootTop, left: rootLeft } = rootRect;

  const fn = (current, rect) => {
    rect = rect || current.getBoundingClientRect();

    const { parentElement } = current;

    if (parentElement === null) {
      return rect;
    }

    const parentRect = parentElement.getBoundingClientRect();

    const {
      top: parentTop,
      left: parentLeft,
      width: parentWidth,
      height: parentHeight,
    } = parentRect;

    const {
      width: childWidth,
      height: childHeight,
      top: childTop,
      left: childLeft,
    } = rect;

    if (parentElement === root) {
      const baseTop = childTop - rootTop;
      const baseLeft = childLeft - rootLeft;

      return {
        width: childWidth,
        height: childHeight,
        top: baseTop + scrollTop,
        left: baseLeft + scrollLeft,
      };
    }

    if (hasScroll(parentElement)) {
      const style = window.getComputedStyle(parentElement);
      const { overflowX, overflowY } = style;

      const visibleX = overflowX === 'visible';
      const visibleY = overflowY === 'visible';
      const childRight = childLeft + childWidth;
      const childBottom = childTop + childHeight;

      const left = visibleX ? childLeft : Math.max(parentLeft, childLeft);
      const right = visibleX ? childRight : Math.min(parentLeft + parentWidth, childRight);
      const top = visibleY ? childTop : Math.max(parentTop, childTop);
      const bottom = visibleY ? childBottom : Math.min(parentTop + parentHeight, childBottom);

      const width = Math.max(right - left, 0);
      const height = Math.max(bottom - top, 0);

      rect = {
        top,
        left,
        width,
        height,
      };
    }

    return fn(parentElement, rect);
  };

  return fn(dom);
};

const calcStyle = (root = document.body) => (dom) => {
  const rect = calcRect(root)(dom) || {};

  return rectToStyle(rect);
};

const renderStyle = (root = document.body) => (dom, style = {}) => {
  Object.entries(style).forEach((entry = []) => {
    const [key, value] = entry;

    if (dom.style[key] === value) {
      return;
    }

    dom.style[key] = value;
  });

  !root.contains(dom) && root.appendChild(dom);
};

function Highlight(root = document.body) {
  let stop;
  let shinyDom;
  let mask = document.createElement('div');

  mask.classList.add('highlight-mask-render');

  const render = (dom) => {
    if (!dom) {
      return;
    }

    const fn = () => {
      const style = calcStyle(root)(dom) || {};
      const computedStyle = window.getComputedStyle(dom);
      const borderRadius = computedStyle.getPropertyValue('border-radius');
      const num = Number(borderRadius.replace(/[a-zA-Z]/g, ''));

      if (num > 2) {
        style['border-radius'] = borderRadius;
      }

      renderStyle(root)(mask, style);
    };

    if (shinyDom === dom) {
      fn();
      return;
    }

    shinyDom = dom;

    const stopLoop = loop(fn, 300);
    const listener = throttle(fn, 100);
    const parentElements = getParentElements(dom) || [];

    this.stop();

    parentElements.forEach((parentElement) => {
      parentElement.addEventListener('scroll', listener);
    });

    stop = () => {
      parentElements.forEach((parentElement) => {
        parentElement.removeEventListener('scroll', listener);
      });

      stopLoop();
    };
  };

  this.mask = mask;
  this.render = render;

  this.stop = () => {
    stop && stop();
  };

  this.clear = () => {
    const { parentElement } = mask;

    mask = null;
    shinyDom = null;
    this.mask = null;
    this.stop();
    parentElement && parentElement.removeChild(mask);
  };
}

window.test = new Highlight();

export default Highlight;
