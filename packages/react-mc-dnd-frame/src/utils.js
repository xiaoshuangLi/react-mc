export const getHTML = (rootDocument = document) => (selector = '') => {
  const eles = rootDocument.querySelectorAll(selector);
  let html = '';

  for (let v = 0; v < eles.length; v += 1) {
    html += eles[v].outerHTML;
  }

  return html;
};

export const getLinkStyleHTML = (rootDocument = document) => {
  const styleSheets = Array.from(rootDocument.styleSheets);

  try {
    return styleSheets.reduce((res = '', styleSheet = {}) => {
      const { cssRules: baseCssRules = [] } = styleSheet;
      const cssRules = Array.from(baseCssRules);

      return cssRules.reduce((curr = '', cssRule = {}) => {
        const { cssText = '' } = cssRule;

        return `${curr} ${cssText}`;
      }, res);
    }, '');
  } catch (e) {
    console.error(e);
    return '';
  }
};

export const getStyleHTML = (rootDocument = document) => {
  const baseStyleHTML = getHTML(rootDocument)('style');
  const linkStyleHTML = getLinkStyleHTML(rootDocument);

  return `${baseStyleHTML}<style>${linkStyleHTML}</style>`;
};

export const getSvgHTML = (rootDocument = document) => getHTML(rootDocument)('svg');
