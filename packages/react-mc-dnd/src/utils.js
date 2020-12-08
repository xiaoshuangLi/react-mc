export const isBetween = (num) => (min, max) => max >= num && min <= num;

export const isUsefulEntry = (context = {}) => (entry = []) => {
  const [key, value] = entry;
  const good = /^on[A-Z]/.test(key);

  if (key in context) {
    return false;
  }

  if (!good) {
    return false;
  }

  if (typeof value !== 'function') {
    return false;
  }

  return true;
};

const message = `react-mc-dnd: data should be object with property "id", as { id: '' }. We got:\n`;

export const check = (data) => {
  if (!data) {
    console.error(message, data);
  } else if (typeof data !== 'object') {
    console.error(message, data);
  } else {
    const had = 'id' in data;
    !had && console.error(message, data);
  }
};

const getPathFromDOM = (dom) => {
  const { parentElement, tagName, ownerDocument = document } = dom;
  const { defaultView = window } = ownerDocument;

  if (parentElement) {
    return [dom, ...getPathFromDOM(parentElement)];
  }

  if (tagName === 'HTML') {
    return [dom, ownerDocument, defaultView];
  }

  return [];
};

export const getPathFromEvent = (e = {}) => {
  const { target = {}, path, composedPath } = e;

  if (Array.isArray(path)) {
    return path;
  }

  if (composedPath) {
    return e.composedPath();
  }

  return getPathFromDOM(target);
};
