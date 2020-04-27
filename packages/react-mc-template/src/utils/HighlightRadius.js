const calcNumber = (length = 0) => (css = '') => {
  const percent = css.includes('%');
  const text = css.replace(/[^0-9.-]/g, '');
  const num = Number(text);

  if (Number.isNaN(num)) {
    return 0;
  }

  return percent
    ? length * num / 100
    : num;
};

const calcCss = (length = 0) => (css = '') => {
  const parts = css.split(/\s/g).filter(
    (item) => !!item.trim(),
  );

  const [a, operator, b] = parts;
  const calc = calcNumber(length);

  if (parts.length === 1) {
    return calc(a);
  }

  switch (operator) {
    case '+':
      return calc(a) + calc(b);
    case '-':
      return calc(a) - calc(b);
    default:
      return 0;
  }
};

const convertCssRadius = (boundingRect = {}) => (cssRadius = '') => {
  const { width, height } = boundingRect;

  const text = cssRadius.replace(/\([^()]*\)/g, '');
  const list = text.split(/\s/).filter(
    (item) => !!item.trim(),
  );

  cssRadius = list.length > 1
    ? cssRadius
    : `${cssRadius} ${cssRadius}`;

  const included = cssRadius.includes('(');
  const reg = included ? /[^\s]*\(|\)/g : /\s/g;

  return cssRadius.split(reg)
    .filter(
      (item) => !!item.trim(),
    )
    .map((item, index) => {
      const length = index % 2 ? height : width;

      return calcCss(length)(item);
    });
};

const toCssRadius = (a = 0, b = 0) => {
  return a === b
    ? `${a}px`
    : `${a}px ${b}px`;
};

const createViewRect = (...points) => {
  const xs = points.map(
    (point = {}) => point.x,
  );

  const ys = points.map(
    (point = {}) => point.y,
  );

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    top: -maxY,
    left: minX,
    width: maxX - minX,
    height: maxY - minY,
  };
};

class HighlightRadius {
  constructor(dom, rect) {
    const computedStyle = window.getComputedStyle(dom);
    const boundingRect = dom.getBoundingClientRect();

    const {
      width: boundingWidth,
      height: boundingHeight,
    } = boundingRect;

    const cssBorderTopLeftRadius = computedStyle.getPropertyValue('border-top-left-radius');
    const cssBorderTopRightRadius = computedStyle.getPropertyValue('border-top-right-radius');
    const cssBorderBottomRightRadius = computedStyle.getPropertyValue('border-bottom-right-radius');
    const cssBorderBottomLeftRadius = computedStyle.getPropertyValue('border-bottom-left-radius');

    const borderTopLeftRadius = convertCssRadius(boundingRect)(cssBorderTopLeftRadius);
    const borderTopRightRadius = convertCssRadius(boundingRect)(cssBorderTopRightRadius);
    const borderBottomRightRadius = convertCssRadius(boundingRect)(cssBorderBottomRightRadius);
    const borderBottomLeftRadius = convertCssRadius(boundingRect)(cssBorderBottomLeftRadius);

    const f = Math.min(
      boundingWidth / (borderTopLeftRadius[0] + borderTopRightRadius[0]),
      boundingHeight / (borderTopRightRadius[1] + borderBottomRightRadius[1]),
      boundingWidth / (borderBottomRightRadius[0] + borderBottomLeftRadius[0]),
      boundingHeight / (borderTopLeftRadius[1] + borderBottomLeftRadius[1]),
      1,
    );

    this.rect = rect;
    this.boundingRect = boundingRect;

    this.borderTopLeftRadius = borderTopLeftRadius.map(
      (item) => item * f,
    );
    this.borderTopRightRadius = borderTopRightRadius.map(
      (item) => item * f,
    );
    this.borderBottomRightRadius = borderBottomRightRadius.map(
      (item) => item * f,
    );
    this.borderBottomLeftRadius = borderBottomLeftRadius.map(
      (item) => item * f,
    );
  }

  findPointY = (origin = {}, segments = []) => (x) => {
    const { x: originX, y: originY } = origin;
    const [a, b] = segments;

    const one = Math.round(((x - originX) / a) ** 2 * 100) / 100;
    const two = (1 - one) ** 0.5 * b;

    return [
      originY - two,
      originY + two,
    ];
  }

  findPointX = (origin = {}, segments = []) => (y) => {
    const { x: originX, y: originY } = origin;
    const [a, b] = segments;

    const one = Math.round(((y - originY) / b) ** 2 * 100) / 100;
    const two = (1 - one) ** 0.5 * a;

    return [
      originX - two,
      originX + two,
    ];
  }

  findTopLeftPoint = () => {
    const {
      top,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusTopLeftA, radiusTopLeftB] = this.borderTopLeftRadius;
    const [radiusBottomLeftA, radiusBottomLeftB] = this.borderBottomLeftRadius;

    const borderTopLineY = -top < -boundingTop
      ? -top
      : -boundingTop;

    if (borderTopLineY >= -boundingTop - boundingHeight && borderTopLineY < -boundingTop - boundingHeight + radiusBottomLeftB) {
      const origin = {
        x: boundingLeft + radiusBottomLeftA,
        y: -boundingTop - boundingHeight + radiusBottomLeftB,
      };

      return {
        x: this.findPointX(origin, this.borderBottomLeftRadius)(borderTopLineY)[0],
        y: borderTopLineY,
      };
    }

    if (borderTopLineY <= -boundingTop - radiusTopLeftB) {
      return {
        x: boundingLeft,
        y: borderTopLineY,
      };
    }

    const origin = {
      x: boundingLeft + radiusTopLeftA,
      y: -boundingTop - radiusTopLeftB,
    };

    return {
      x: this.findPointX(origin, this.borderTopLeftRadius)(borderTopLineY)[0],
      y: borderTopLineY,
    };
  }

  findTopRightPoint() {
    const {
      top,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusTopRightA, radiusTopRightB] = this.borderTopRightRadius;
    const [radiusBottomRightA, radiusBottomRightB] = this.borderBottomRightRadius;

    const borderTopLineY = -top < -boundingTop
      ? -top
      : -boundingTop;

    if (borderTopLineY >= -boundingTop - boundingHeight && borderTopLineY < -boundingTop - boundingHeight + radiusBottomRightB) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusBottomRightA,
        y: -boundingTop - boundingHeight + radiusBottomRightB,
      };

      return {
        x: this.findPointX(origin, this.borderBottomRightRadius)(borderTopLineY)[1],
        y: borderTopLineY,
      };
    }

    if (borderTopLineY <= -boundingTop - radiusTopRightB) {
      return {
        x: boundingLeft + boundingWidth,
        y: borderTopLineY,
      };
    }

    const origin = {
      x: boundingLeft + boundingWidth - radiusTopRightA,
      y: -boundingTop - radiusTopRightB,
    };

    return {
      x: this.findPointX(origin, this.borderTopRightRadius)(borderTopLineY)[1],
      y: borderTopLineY,
    };
  }

  findRightTopPoint() {
    const {
      left,
      width,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
    } = this.boundingRect;

    const [radiusTopLeftA, radiusTopLeftB] = this.borderTopLeftRadius;
    const [radiusTopRightA, radiusTopRightB] = this.borderTopRightRadius;

    const borderRightLineX = left + width < boundingLeft + boundingWidth
      ? left + width
      : boundingLeft + boundingWidth;

    if (borderRightLineX >= boundingLeft && borderRightLineX <= boundingLeft + radiusTopLeftA) {
      const origin = {
        x: boundingLeft + radiusTopLeftA,
        y: -boundingTop - radiusTopLeftB,
      };

      return {
        x: borderRightLineX,
        y: this.findPointY(origin, this.borderTopLeftRadius)(borderRightLineX)[1],
      };
    }

    if (borderRightLineX <= boundingLeft + boundingWidth - radiusTopRightB) {
      return {
        x: borderRightLineX,
        y: -boundingTop,
      };
    }

    const origin = {
      x: boundingLeft + boundingWidth - radiusTopRightA,
      y: -boundingTop - radiusTopRightB,
    };

    return {
      x: borderRightLineX,
      y: this.findPointY(origin, this.borderTopRightRadius)(borderRightLineX)[1],
    };
  }

  findRightBottomPoint() {
    const {
      left,
      width,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusBottomLeftA, radiusBottomLeftB] = this.borderBottomLeftRadius;
    const [radiusBottomRightA, radiusBottomRightB] = this.borderBottomRightRadius;

    const borderRightLineX = left + width < boundingLeft + boundingWidth
      ? left + width
      : boundingLeft + boundingWidth;

    if (borderRightLineX >= boundingLeft && borderRightLineX <= boundingLeft + radiusBottomLeftA) {
      const origin = {
        x: boundingLeft + radiusBottomLeftA,
        y: -boundingTop - boundingHeight + radiusBottomLeftB,
      };

      return {
        x: borderRightLineX,
        y: this.findPointY(origin, this.borderBottomLeftRadius)(borderRightLineX)[0],
      };
    }

    if (borderRightLineX <= boundingLeft + boundingWidth - radiusBottomRightB) {
      return {
        x: borderRightLineX,
        y: -boundingTop - boundingHeight,
      };
    }

    const origin = {
      x: boundingLeft + boundingWidth - radiusBottomRightA,
      y: -boundingTop - boundingHeight + radiusBottomRightB,
    };

    return {
      x: borderRightLineX,
      y: this.findPointY(origin, this.borderBottomRightRadius)(borderRightLineX)[0],
    };
  }

  findBottomLeftPoint() {
    const {
      top,
      height,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusTopLeftA, radiusTopLeftB] = this.borderTopLeftRadius;
    const [radiusBottomLeftA, radiusBottomLeftB] = this.borderBottomLeftRadius;

    const borderBottomLineY = -top - height > -boundingTop - boundingHeight
      ? -top - height
      : -boundingTop - boundingHeight;

    if (borderBottomLineY <= -boundingTop && borderBottomLineY >= -boundingTop - radiusTopLeftB) {
      const origin = {
        x: boundingLeft + radiusTopLeftA,
        y: -boundingTop - radiusTopLeftB,
      };

      return {
        x: this.findPointX(origin, this.borderTopLeftRadius)(borderBottomLineY)[0],
        y: borderBottomLineY,
      };
    }

    if (borderBottomLineY >= -boundingTop - boundingHeight + radiusBottomLeftB) {
      return {
        x: boundingLeft,
        y: borderBottomLineY,
      };
    }

    const origin = {
      x: boundingLeft + radiusBottomLeftA,
      y: -boundingTop - boundingHeight + radiusBottomLeftB,
    };

    return {
      x: this.findPointX(origin, this.borderBottomLeftRadius)(borderBottomLineY)[0],
      y: borderBottomLineY,
    };
  }

  findBottomRightPoint() {
    const {
      top,
      height,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusTopRightA, radiusTopRightB] = this.borderTopRightRadius;
    const [radiusBottomRightA, radiusBottomRightB] = this.borderBottomRightRadius;

    const borderBottomLineY = -top - height > -boundingTop - boundingHeight
      ? -top - height
      : -boundingTop - boundingHeight;

    if (borderBottomLineY <= -boundingTop && borderBottomLineY >= -boundingTop - radiusTopRightB) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusTopRightA,
        y: -boundingTop - radiusTopRightB,
      };

      return {
        x: this.findPointX(origin, this.borderTopRightRadius)(borderBottomLineY)[1],
        y: borderBottomLineY,
      };
    }

    if (borderBottomLineY >= -boundingTop - boundingHeight + radiusBottomRightB) {
      return {
        x: boundingLeft + boundingWidth,
        y: borderBottomLineY,
      };
    }

    const origin = {
      x: boundingLeft + boundingWidth - radiusBottomRightA,
      y: -boundingTop - boundingHeight + radiusBottomRightB,
    };

    return {
      x: this.findPointX(origin, this.borderBottomRightRadius)(borderBottomLineY)[1],
      y: borderBottomLineY,
    };
  }

  findLeftTopPoint() {
    const {
      left,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
    } = this.boundingRect;

    const [radiusTopLeftA, radiusTopLeftB] = this.borderTopLeftRadius;
    const [radiusTopRightA, radiusTopRightB] = this.borderTopRightRadius;

    const borderLeftLineX = left < boundingLeft
      ? boundingLeft
      : left;

    if (borderLeftLineX >= boundingLeft + boundingWidth - radiusTopRightA && borderLeftLineX <= boundingLeft + boundingWidth) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusTopRightA,
        y: -boundingTop - radiusTopRightB,
      };

      return {
        x: borderLeftLineX,
        y: this.findPointY(origin, this.borderTopRightRadius)(borderLeftLineX)[1],
      };
    }

    if (borderLeftLineX >= boundingLeft + radiusTopLeftA) {
      return {
        x: borderLeftLineX,
        y: -boundingTop,
      };
    }

    const origin = {
      x: boundingLeft + radiusTopLeftA,
      y: -boundingTop - radiusTopLeftB,
    };

    return {
      x: borderLeftLineX,
      y: this.findPointY(origin, this.borderTopLeftRadius)(borderLeftLineX)[1],
    };
  }

  findLeftBottomPoint() {
    const {
      left,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusBottomLeftA, radiusBottomLeftB] = this.borderBottomLeftRadius;
    const [radiusBottomRightA, radiusBottomRightB] = this.borderBottomRightRadius;

    const borderLeftLineX = left < boundingLeft
      ? boundingLeft
      : left;

    if (borderLeftLineX >= boundingLeft + boundingWidth - radiusBottomRightA && borderLeftLineX <= boundingLeft + boundingWidth) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusBottomRightA,
        y: -boundingTop - boundingHeight + radiusBottomRightB,
      };

      return {
        x: borderLeftLineX,
        y: this.findPointY(origin, this.borderBottomRightRadius)(borderLeftLineX)[0],
      };
    }

    if (borderLeftLineX >= boundingLeft + radiusBottomLeftA) {
      return {
        x: borderLeftLineX,
        y: -boundingTop - boundingHeight,
      };
    }

    const origin = {
      x: boundingLeft + radiusBottomLeftA,
      y: -boundingTop - boundingHeight + radiusBottomLeftB,
    };

    return {
      x: borderLeftLineX,
      y: this.findPointY(origin, this.borderBottomLeftRadius)(borderLeftLineX)[0],
    };
  }

  findTopPoints() {
    const {
      left,
      width,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
    } = this.boundingRect;

    const [radiusTopLeftA, radiusTopLeftB] = this.borderTopLeftRadius;
    const [radiusTopRightA, radiusTopRightB] = this.borderTopRightRadius;

    const borderLeftLineX = left;
    const borderRightLineX = left + width;

    if (borderLeftLineX > boundingLeft + boundingWidth - radiusTopRightA && borderLeftLineX < boundingLeft + boundingWidth) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusTopRightA,
        y: -boundingTop - radiusTopRightB,
      };

      const point = {
        x: borderLeftLineX,
        y: this.findPointY(origin, this.borderTopRightRadius)(borderLeftLineX)[1],
      };

      return [point, point];
    }

    if (borderRightLineX > boundingLeft && borderRightLineX < boundingLeft + radiusTopLeftA) {
      const origin = {
        x: boundingLeft + radiusTopLeftA,
        y: -boundingTop - radiusTopLeftB,
      };

      const point = {
        x: borderRightLineX,
        y: this.findPointY(origin, this.borderTopLeftRadius)(borderRightLineX)[1],
      };

      return [point, point];
    }

    return [
      this.findTopLeftPoint(),
      this.findTopRightPoint(),
    ];
  }

  findRightPoints() {
    const {
      top,
      height,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusTopRightA, radiusTopRightB] = this.borderTopRightRadius;
    const [radiusBottomRightA, radiusBottomRightB] = this.borderBottomRightRadius;

    const borderTopLineY = -top;
    const borderBottomLineY = -top - height;

    if (borderBottomLineY > -boundingTop - radiusTopRightB && borderBottomLineY < -boundingTop) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusTopRightA,
        y: -boundingTop - radiusTopRightB,
      };

      const point = {
        x: this.findPointX(origin, this.borderTopRightRadius)(borderBottomLineY)[1],
        y: borderBottomLineY,
      };

      return [point, point];
    }

    if (borderTopLineY > -boundingTop - boundingHeight && borderTopLineY < -boundingTop - boundingHeight + radiusBottomRightB) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusBottomRightA,
        y: -boundingTop - boundingHeight + radiusBottomRightB,
      };

      const point = {
        x: this.findPointX(origin, this.borderBottomRightRadius)(borderTopLineY)[1],
        y: borderTopLineY,
      };

      return [point, point];
    }

    return [
      this.findRightTopPoint(),
      this.findRightBottomPoint(),
    ];
  }

  findBottomPoints() {
    const {
      left,
      width,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      width: boundingWidth,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusBottomLeftA, radiusBottomLeftB] = this.borderBottomLeftRadius;
    const [radiusBottomRightA, radiusBottomRightB] = this.borderBottomRightRadius;

    const borderLeftLineX = left;
    const borderRightLineX = left + width;

    if (borderLeftLineX > boundingLeft + boundingWidth - radiusBottomRightA && borderLeftLineX < boundingLeft + boundingWidth) {
      const origin = {
        x: boundingLeft + boundingWidth - radiusBottomRightA,
        y: -boundingTop - boundingHeight + radiusBottomRightB,
      };

      const point = {
        x: borderLeftLineX,
        y: this.findPointY(origin, this.borderBottomRightRadius)(borderLeftLineX)[0],
      };

      return [point, point];
    }

    if (borderRightLineX > boundingLeft && borderRightLineX < boundingLeft + radiusBottomLeftA) {
      const origin = {
        x: boundingLeft + radiusBottomLeftA,
        y: -boundingTop - boundingHeight + radiusBottomLeftB,
      };

      const point = {
        x: borderRightLineX,
        y: this.findPointY(origin, this.borderBottomLeftRadius)(borderRightLineX)[0],
      };

      return [point, point];
    }

    return [
      this.findBottomLeftPoint(),
      this.findBottomRightPoint(),
    ];
  }

  findLeftPoints() {
    const {
      top,
      height,
    } = this.rect;

    const {
      top: boundingTop,
      left: boundingLeft,
      height: boundingHeight,
    } = this.boundingRect;

    const [radiusTopLeftA, radiusTopLeftB] = this.borderTopLeftRadius;
    const [radiusBottomLeftA, radiusBottomLeftB] = this.borderBottomLeftRadius;

    const borderTopLineY = -top;
    const borderBottomLineY = -top - height;

    if (borderBottomLineY > -boundingTop - radiusTopLeftB && borderBottomLineY < -boundingTop) {
      const origin = {
        x: boundingLeft + radiusTopLeftA,
        y: -boundingTop - radiusTopLeftB,
      };

      const point = {
        x: this.findPointX(origin, this.borderTopLeftRadius)(borderBottomLineY)[0],
        y: borderBottomLineY,
      };

      return [point, point];
    }

    if (borderTopLineY > -boundingTop - boundingHeight && borderTopLineY < -boundingTop - boundingHeight + radiusBottomLeftB) {
      const origin = {
        x: boundingLeft + radiusBottomLeftA,
        y: -boundingTop - boundingHeight + radiusBottomLeftB,
      };

      const point = {
        x: this.findPointX(origin, this.borderBottomLeftRadius)(borderTopLineY)[0],
        y: borderTopLineY,
      };

      return [point, point];
    }

    return [
      this.findLeftTopPoint(),
      this.findLeftBottomPoint(),
    ];
  }

  convertPoint = (point = {}) => {
    const {
      top,
      left,
      width,
      height,
    } = this.rect;

    const { x, y, ...others } = point;

    return {
      x: Math.min(Math.max(left, x), left + width),
      y: Math.max(Math.min(-top, y), -top - height),
      ...others,
    };
  };

  getStyle() {
    let topPoints = this.findTopPoints() || [];
    let rightPoints = this.findRightPoints() || [];
    let bottomPoints = this.findBottomPoints() || [];
    let leftPoints = this.findLeftPoints() || [];

    topPoints = topPoints.map(this.convertPoint);
    rightPoints = rightPoints.map(this.convertPoint);
    bottomPoints = bottomPoints.map(this.convertPoint);
    leftPoints = leftPoints.map(this.convertPoint);

    const viewRect = createViewRect(
      ...topPoints,
      ...rightPoints,
      ...bottomPoints,
      ...leftPoints,
    ) || {};

    const {
      top: viewTop,
      left: viewLeft,
      width: viewWidth,
      height: viewHeight,
    } = viewRect;

    const borderTopLeftRadiusA = Math.abs(topPoints[0].x - leftPoints[0].x);
    const borderTopLeftRadiusB = Math.abs(topPoints[0].y - leftPoints[0].y);

    const borderTopRightRadiusA = Math.abs(topPoints[1].x - rightPoints[0].x);
    const borderTopRightRadiusB = Math.abs(topPoints[1].y - rightPoints[0].y);

    const borderBottomRightRadiusA = Math.abs(bottomPoints[1].x - rightPoints[1].x);
    const borderBottomRightRadiusB = Math.abs(bottomPoints[1].y - rightPoints[1].y);

    const borderBottomLeftRadiusA = Math.abs(bottomPoints[0].x - leftPoints[1].x);
    const borderBottomLeftRadiusB = Math.abs(bottomPoints[0].y - leftPoints[1].y);

    return {
      width: `${viewWidth}px`,
      height: `${viewHeight}px`,
      transform: `translate(${viewLeft}px, ${viewTop}px)`,
      'border-top-left-radius': toCssRadius(borderTopLeftRadiusA, borderTopLeftRadiusB),
      'border-top-right-radius': toCssRadius(borderTopRightRadiusA, borderTopRightRadiusB),
      'border-bottom-right-radius': toCssRadius(borderBottomRightRadiusA, borderBottomRightRadiusB),
      'border-bottom-left-radius': toCssRadius(borderBottomLeftRadiusA, borderBottomLeftRadiusB),
    };
  }
}

export default HighlightRadius;
