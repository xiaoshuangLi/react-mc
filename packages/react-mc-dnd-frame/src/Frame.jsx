import React, {
  useRef,
  useMemo,
  useEffect,
  useContext,
  forwardRef,
} from 'react';
import { DndContext } from 'react-dnd';
import FrameComponent, { FrameContext } from 'react-frame-component';

import { useThrottleCallback } from 'shared/hooks';

import { getStyleHTML, getSvgHTML } from './utils';

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

  const styleNode = useMemo(() => {
    const content = getStyleAndSVG();
    const dangerouslySetInnerHTML = {
      __html: content,
    };

    return (
      <div
        ref={ref}
        style={invisibleStyle}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    );
  }, []);

  const callback = useThrottleCallback(() => {
    const { current } = ref;

    if (!current) {
      return;
    }

    const { innerHTML } = current;
    const content = getStyleAndSVG();

    if (innerHTML === content) {
      return;
    }

    current.innerHTML = content;
  }, 100);

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
