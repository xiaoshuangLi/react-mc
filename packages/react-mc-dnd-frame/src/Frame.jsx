import React, {
  useRef,
  useMemo,
  useEffect,
  useContext,
  forwardRef,
} from 'react';
import { DndContext } from 'react-dnd';
import FrameComponent, { FrameContext } from 'react-frame-component';

import { isSame } from 'shared/array';
import { useDebounceCallback } from 'shared/hooks';

import {
  getStyledElments,
  getStyleHTML,
  getSvgHTML,
} from './utils';

const invisibleStyle = {
  opacity: 0,
  position: 'fixed',
  pointerEvents: 'none',
};

const getStyleAndSVG = () => {
  const styleHTML = getStyleHTML(document);
  const svgHTML = getSvgHTML(document);

  return `${styleHTML}${svgHTML}`;
};

const FrameContent = (props = {}) => {
  const { children } = props;

  const { dragDropManager } = useContext(DndContext);

  const {
    window: contextWindow = window,
    document: contextDocument = document,
  } = useContext(FrameContext);

  const ref = useRef();
  const elementsRef = useRef([]);

  const styleNode = useMemo(() => {
    const html = getStyleAndSVG() || '';
    const elements = getStyledElments() || [];
    const dangerouslySetInnerHTML = { __html: html };

    elementsRef.current = elements;

    return (
      <div
        ref={ref}
        style={invisibleStyle}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    );
  }, []);

  const callback = useDebounceCallback(() => {
    const { current } = ref;
    const { current: prevElements = [] } = elementsRef;

    if (!current) {
      return;
    }

    const nextElements = getStyledElments() || [];
    const same = isSame(prevElements, nextElements);

    if (same) {
      return;
    }

    const content = getStyleAndSVG() || '';

    current.innerHTML = content;
    elementsRef.current = nextElements;
  }, 300, { maxWait: 0, leading: true, trailing: true });

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
    if (contextWindow !== window) {
      dragDropManager.getBackend().addEventListeners(contextWindow);
      return () => dragDropManager.getBackend().removeEventListeners(contextWindow);
    }
  }, [contextWindow, dragDropManager]);

  return (
    <>
      { styleNode }
      { children }
    </>
  );
};

export const Frame = forwardRef((props = {}, ref) => {
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
