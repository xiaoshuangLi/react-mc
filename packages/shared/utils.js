const getValue = (event) => {
  if (!event) {
    return event;
  }

  const target = event.target === undefined ? event : event.target;
  const value = target.value === undefined ? target : target.value;

  if (target instanceof HTMLElement) {
    return target.type === 'checkbox' ? target.checked : value;
  }

  return target;
};

export const getFromEvent = (event) => {
  const value = getValue(event);

  return value === undefined
    ? getValue(event.nativeEvent)
    : value;
};

export const getValueByKeys = (obj = {}, keys = []) => {
  if (!keys.length) {
    return;
  }

  let res = obj;

  for (let v = 0; v < keys.length; v += 1) {
    const key = keys[v];

    if (res === null) {
      return null;
    }

    if (res[key] === undefined) {
      return;
    }

    res = res[key];
  }

  return res;
};

const merge = (a = {}, b) => {
  if (Array.isArray(a)) {
    return Object.assign([], a, b);
  }

  return { ...a, ...b };
};

export const setValueByKeys = (obj = {}, keys = [], newValue) => {
  const [firstKey] = keys;
  const baseValues = [];
  const max = keys.length - 1;

  keys.forEach((key, index) => {
    let curr;

    if (index === max) {
      curr = newValue;
    } else {
      const nextKey = keys[index + 1];
      const prevValue = index === 0 ? obj : baseValues[index - 1];
      const defaultValue = typeof nextKey === 'number' ? [] : {};

      curr = prevValue[key] === undefined ? defaultValue : prevValue[key];

      if (typeof key === 'number' && index > 0) {
        const parentValue = baseValues[index - 1];
        const length = Math.max(key + 1, parentValue.length);
        const info = { ...parentValue, length };

        baseValues[index - 1] = Array.from(info).map(
          (item = defaultValue) => item,
        );
      }
    }

    baseValues.push(curr);
  });

  for (let index = max; index >= 0; index -= 1) {
    const nextKey = keys[index + 1];

    const next = baseValues[index + 1];
    const curr = baseValues[index];

    if (index === max) {
      baseValues[index] = newValue;
    } else {
      baseValues[index] = merge(curr, {
        [nextKey]: next,
      });
    }
  }

  const prevValue = obj[firstKey];
  const [nextValue] = baseValues;

  if (prevValue === nextValue) {
    return obj;
  }

  return merge(obj, {
    [firstKey]: nextValue,
  });
};
