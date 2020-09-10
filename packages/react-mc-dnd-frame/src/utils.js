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

export const elementToHTML = (rootDocument = document) => (element) => {
  if (!element) {
    return;
  }

  const {
    href,
    outerHTML,
    tagName = '',
  } = element;

  const tag = tagName && tagName.toUpperCase();

  switch (tag) {
    case 'LINK': {
      const styleSheets = Array.from(rootDocument.styleSheets);
      const styleSheet = styleSheets.find(
        (item = {}) => item.href === href,
      );

      if (!styleSheet) {
        return outerHTML;
      }

      try {
        const { cssRules: baseCssRules = [] } = styleSheet;
        const cssRules = Array.from(baseCssRules);

        const styleHTML = cssRules.reduce((curr = '', cssRule = {}) => {
          const { cssText = '' } = cssRule;

          return `${curr} ${cssText}`;
        }, '');

        return `<style>${styleHTML}</style>`;
      } catch (e) {
        return outerHTML;
      }
    }
    default:
      return outerHTML;
  }
};

export const getHTML = (rootDocument = document) => (selector = '') => {
  const elements = getUsefulElements(rootDocument)(selector);

  return elements.reduce((res, element) => {
    const html = elementToHTML(rootDocument)(element) || '';

    return `${res}${html}`;
  }, '');
};

export const getLinkStyleHTML = (rootDocument = document) => {
  const linkElements = getUsefulElements(rootDocument)('link[rel="stylesheet"]');

  return linkElements.reduce((res = '', linkElement = {}) => {
    const html = elementToHTML(rootDocument)(linkElement) || '';

    return `${res}${html}`;
  }, '');
};

export const getStyleHTML = (rootDocument = document) => {
  const baseStyleHTML = getHTML(rootDocument)('style');
  const linkStyleHTML = getLinkStyleHTML(rootDocument);

  return `${baseStyleHTML}${linkStyleHTML}`;
};

export const getSvgHTML = (rootDocument = document) => getHTML(rootDocument)('svg');
