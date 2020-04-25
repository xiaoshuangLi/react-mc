import throttle from 'lodash/throttle';

import HighlightRadius from './HighlightRadius';

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

const isDocumentElement = (dom = {}) => {
  const { tagName } = dom;

  return tagName === 'HTML';
};

const getParentElements = (dom) => {
  if (!dom) {
    return [];
  }

  const { parentElement } = dom;
  const parentElements = getParentElements(parentElement) || [];

  if (isDocumentElement(dom)) {
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

  return {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: `${Math.max(width, 0)}px`,
    height: `${Math.max(height, 0)}px`,
    opacity: width * height > 0 ? '1' : '0',
    transform: `translate(${left}px, ${top}px)`,
    border: '1px solid rgb(24, 144, 255)',
    'transition-duration': '0.2s',
    'border-radius': '2px',
    'pointer-events': 'none',
    'box-sizing': 'border-box',
    'z-index': '10000',
  };
};

const calcRect = (root = document.documentElement) => (dom) => {
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

    let {
      width: childWidth,
      height: childHeight,
      top: childTop,
      left: childLeft,
    } = rect;

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

    childWidth = rect.width;
    childHeight = rect.height;
    childTop = rect.top;
    childLeft = rect.left;

    if (parentElement === root) {
      let width;
      let height;
      let top;
      let left;

      if (isDocumentElement(root)) {
        const { ownerDocument: { body } } = root;

        const bodyRect = body.getBoundingClientRect();
        const { width: bodyWidth, height: bodyHeight } = bodyRect;

        top = Math.max(0, childTop);
        left = Math.max(0, childLeft);

        width = Math.max(0, childWidth + Math.min(childLeft, 0));
        height = Math.max(0, childHeight + Math.min(childTop, 0));
        width = Math.min(width, bodyWidth - left);
        height = Math.min(height, bodyHeight - top);
      } else {
        const baseTop = childTop - rootTop;
        const baseLeft = childLeft - rootLeft;

        width = childWidth;
        height = childHeight;
        top = baseTop + scrollTop;
        left = baseLeft + scrollLeft;
      }

      return {
        width,
        height,
        top,
        left,
      };
    }

    return fn(parentElement, rect);
  };

  return fn(dom);
};

const renderStyle = (root = document.documentElement) => (dom, style = {}) => {
  if (!root.contains(dom)) {
    const parent = isDocumentElement(root)
      ? root.ownerDocument.body
      : root;

    parent.appendChild(dom);
  }

  Object.entries(style).forEach((entry = []) => {
    const [key, value] = entry;

    if (dom.style[key] === value) {
      return;
    }

    dom.style[key] = value;
  });
};

function Highlight(root = document.documentElement) {
  const { ownerDocument } = root;

  let stop;
  let shinyDom;
  let maskStyle = {};
  let mask = ownerDocument.createElement('div');

  mask.classList.add('highlight-mask-render');

  const render = (dom, moreStyle = {}) => {
    maskStyle = moreStyle;

    if (!dom) {
      return;
    }

    const fn = () => {
      const rect = calcRect(root)(dom) || {};
      const style = rectToStyle(rect) || {};

      const boundingRect = dom.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(dom);
      const borderRadius = computedStyle.getPropertyValue('border-radius');
      const transform = computedStyle.getPropertyValue('transform');

      const num = Number(borderRadius.replace(/[a-zA-Z]/g, ''));
      const useless = Number.isNaN(num);

      const { width, height } = rect;
      const { width: boundingWidth, height: boundingHeight } = boundingRect;

      if (transform && transform !== 'none') {
        style['border-radius'] = '2px';
      } else if (boundingWidth === width && boundingHeight === height) {
        if (useless || num > 2) {
          style['border-radius'] = borderRadius;
        } else {
          style['border-radius'] = '2px';
        }
      } else if (useless || num > 2) {
        delete style['border-radius'];

        const radius = new HighlightRadius(dom, rect);
        const borderRadiusStyle = radius.getStyle() || {};

        Object.assign(style, borderRadiusStyle);
      } else {
        style['border-radius'] = '2px';
      }

      Object.assign(style, maskStyle);

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

    parentElements.forEach((parentElement = {}) => {
      const element = isDocumentElement(parentElement)
        ? ownerDocument
        : parentElement;

      element.addEventListener('scroll', listener);
    });

    stop = () => {
      parentElements.forEach((parentElement = {}) => {
        const element = isDocumentElement(parentElement)
          ? ownerDocument
          : parentElement;

        element.removeEventListener('scroll', listener);
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

    this.stop();
    parentElement && parentElement.removeChild(mask);

    mask = null;
    shinyDom = null;
    this.mask = null;
  };
}

export default Highlight;
