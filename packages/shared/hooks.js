import {
  useRef,
  useEffect,
  useCallback,
} from 'react';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

export const useEventCallback = (fn) => {
  const ref = useRef(fn);

  ref.current = fn;

  return useCallback((...args) => {
    const { current } = ref;

    return current && current(...args);
  }, [ref]);
};

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export const useThrottleCallback = (callback, ...args) => {
  const fn = useEventCallback(callback);

  return useCallback(throttle(fn, ...args), [fn]);
};

export const useDebounceCallback = (callback, ...args) => {
  const fn = useEventCallback(callback);

  return useCallback(debounce(fn, ...args), [fn]);
};
