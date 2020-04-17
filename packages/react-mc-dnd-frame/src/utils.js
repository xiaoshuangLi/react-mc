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

  return styleSheets.reduce((res = '', styleSheet = {}) => {
    try {
      const { cssRules: baseCssRules = [] } = styleSheet;
      const cssRules = Array.from(baseCssRules);

      return cssRules.reduce((curr = '', cssRule = {}) => {
        const { cssText = '' } = cssRule;

        return `${curr} <style>${cssText}</style>`;
      }, res);
    } catch (e) {
      const { href } = styleSheet;
      const linkHTML = `
        <link rel="stylesheet" type="text/css" href="${href}">
      `;

      console.error(e);
      return `${res}${linkHTML}`;
    }
  }, '');
};

export const getStyleHTML = (rootDocument = document) => {
  const baseStyleHTML = getHTML(rootDocument)('style');
  const linkStyleHTML = getLinkStyleHTML(rootDocument);

  return `${baseStyleHTML}${linkStyleHTML}`;
};

export const getSvgHTML = (rootDocument = document) => getHTML(rootDocument)('svg');
