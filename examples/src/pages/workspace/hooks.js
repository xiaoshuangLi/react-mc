import { useRef, useCallback } from 'react';

export const useEventCallback = (fn) => {
  const ref = useRef(fn);

  ref.current = fn;

  return useCallback((...args) => {
    const { current } = ref;

    return current && current(...args);
  }, [ref]);
};

export const useArgumentValue = (props = {}, index = 0) => {
  const {
    value: propsValue = [],
    onChange: propsOnChange,
  } = props;

  const value = propsValue[index];
  const setValue = useEventCallback((current) => {
    const array = propsValue.slice();

    array[index] = current;
    propsOnChange && propsOnChange(array);
  });

  return propsOnChange
    ? [value, setValue]
    : [value];
};
