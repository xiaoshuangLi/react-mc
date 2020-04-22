export const getElements = (rootDocument = document) => (selector = '') => {
  const elements = rootDocument.querySelectorAll(selector);

  return Array.from(elements);
};

export const getUsefulElements = (rootDocument = document) => (selector = '') => {
  const elements = getElements(rootDocument)(selector);

  const ignoredSelector = selector
    .split(',')
    .map((text = '') => `[data-frame-ignore] ${text}`)
    .join(',');
  const ignoredElements = getElements(rootDocument)(ignoredSelector);

  return elements.filter((element) => {
    return !ignoredElements.includes(element);
  });
};

export const getStyledElments = (rootDocument = document) => {
  return getUsefulElements(rootDocument)('style,link,svg');
};

export const getHTML = (rootDocument = document) => (selector = '') => {
  const elements = getUsefulElements(rootDocument)(selector);

  return elements.reduce((res, element) => {
    return `${res}${element.outerHTML}`;
  }, '');
};

export const getLinkStyleHTML = (rootDocument = document) => {
  const linkElements = getUsefulElements(rootDocument)('link[rel="stylesheet"]');
  const styleSheets = Array.from(rootDocument.styleSheets);

  return linkElements.reduce((res = '', linkElement = {}) => {
    const { href, outerHTML } = linkElement;

    const styleSheet = styleSheets.find(
      (item = {}) => item.href === href,
    );

    if (!styleSheet) {
      return `${res}${outerHTML}`;
    }

    try {
      const { cssRules: baseCssRules = [] } = styleSheet;
      const cssRules = Array.from(baseCssRules);

      const styleHTML = cssRules.reduce((curr = '', cssRule = {}) => {
        const { cssText = '' } = cssRule;

        return `${curr} ${cssText}`;
      }, '');

      return `${res}<style>${styleHTML}</style>`;
    } catch (e) {
      return `${res}${outerHTML}`;
    }
  }, '');
};

export const getStyleHTML = (rootDocument = document) => {
  const baseStyleHTML = getHTML(rootDocument)('style');
  const linkStyleHTML = getLinkStyleHTML(rootDocument);

  return `${baseStyleHTML}${linkStyleHTML}`;
};

export const getSvgHTML = (rootDocument = document) => getHTML(rootDocument)('svg');
