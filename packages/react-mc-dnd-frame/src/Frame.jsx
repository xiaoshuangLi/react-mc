import React, {
  memo,
  useMemo,
  useState,
  useEffect,
  useContext,
  forwardRef,
} from 'react';
import { DndContext } from 'react-dnd';
import FrameComponent, { FrameContext } from 'react-frame-component';

import { isSame } from 'shared/array';
import { MemoMap } from 'shared/memoize';
import { useDebounceCallback } from 'shared/hooks';

import {
  getStyledElments,
  elementToHTML,
} from './utils';

const invisibleStyle = {
  opacity: 0,
  position: 'fixed',
  pointerEvents: 'none',
};

const Style = memo((props = {}) => {
  const {
    element,
    document: propsDocument = document,
  } = props;

  const html = useMemo(
    () => elementToHTML(propsDocument)(element) || '',
    [element, propsDocument],
  );

  if (!element) {
    return null;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
});

const FrameContent = (props = {}) => {
  const { children } = props;

  const { dragDropManager } = useContext(DndContext);

  const {
    window: contextWindow = window,
    document: contextDocument = document,
  } = useContext(FrameContext);

  const [elements = [], setElements] = useState(() => {
    return getStyledElments() || [];
  });

  const memoMap = useMemo(
    () => new MemoMap(),
    [],
  );

  const styleNode = useMemo(() => {
    const items = elements.map((element) => {
      const key = memoMap.get(element);

      return (
        <Style
          key={key}
          element={element}
          window={contextWindow}
          document={contextDocument}
        />
      );
    });

    return (
      <div style={invisibleStyle}>{ items }</div>
    );
  }, [elements, memoMap, contextWindow, contextDocument]);

  const callback = useDebounceCallback(() => {
    const nextElements = getStyledElments() || [];
    const same = isSame(elements, nextElements);

    !same && setElements(nextElements);
  }, 300, { maxWait: 0, leading: true, trailing: true });

  useEffect(
    () => memoMap.clear,
    [memoMap],
  );

  useEffect(() => {
    if (contextDocument === document) {
      return;
    }

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);

    observer.observe(document.head, config);
    observer.observe(document.body, config);
    callback();

    return () => observer.disconnect();
  }, [callback, contextDocument]);

  useEffect(() => {
    if (!dragDropManager) {
      return;
    }

    if (contextWindow === window) {
      return;
    }

    dragDropManager.getBackend().addEventListeners(contextWindow);
    return () => dragDropManager.getBackend().removeEventListeners(contextWindow);
  }, [contextWindow, dragDropManager]);

  return (
    <>
      { styleNode }
      { children }
    </>
  );
};

const Frame = forwardRef((props = {}, ref) => {
  const {
    className,
    children,
    style: propsStyle = {},
    ...others
  } = props;

  const cls = `react-mc-dnd-frame-render ${className || ''}`;
  const style = {
    border: 'none',
    display: 'block',
    ...propsStyle,
  };

  return (
    <FrameComponent ref={ref} className={cls} style={style} {...others}>
      <FrameContent>
        { children }
      </FrameContent>
    </FrameComponent>
  );
});

export default Frame;
