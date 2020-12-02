import React, {
  useMemo,
  createRef,
  forwardRef,
} from 'react';

import { check } from './utils';

import {
  useContainer,
  useDragAndHover,
  useDrag,
  useDrop,
  useDragAndDrop,
} from './hooks';

const useStableRef = (ref) => useMemo(() => {
  return ref || createRef();
}, [ref]);

export const withContainer = (ComponentClass, data = {}) => forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  check(data);
  useContainer(ref, data);

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

export const withDrag = (ComponentClass, data = {}) => forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  check(data);
  useDrag(ref, data);

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

export const withDrop = (ComponentClass, targetInfo = {}) => forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  useDrop(ref, targetInfo);

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

export const withDragAndHover = (ComponentClass, data = {}) => forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  check(data);
  useDragAndHover(ref, data);

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

export const withDragAndDrop = (ComponentClass, data = {}) => forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  check(data);
  useDragAndDrop(ref, data);

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

export default withDragAndDrop;
