import React, {
  useEffect,
  useContext,
  forwardRef,
} from 'react';
import { DndContext } from 'react-dnd';
import FrameComponent, { FrameContext } from 'react-frame-component';
import throttle from 'lodash/throttle';

import { getStyleHTML, getSvgHTML } from './utils';

const FrameContent = (props = {}) => {
  const { children } = props;

  const { dragDropManager } = useContext(DndContext);
  const {
    window: contextWindow = window,
    document: contextDocument = document,
  } = useContext(FrameContext);

  useEffect(() => {
    if (contextDocument === document) {
      return;
    }

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    const container = contextDocument.createElement('div');

    const config = { childList: true, subtree: true };
    const callback = throttle(() => {
      const { innerHTML } = container;

      const styleHTML = getStyleHTML(document);
      const svgHTML = getSvgHTML(document);

      const content = `${styleHTML}${svgHTML}`;

      if (innerHTML === content) {
        return;
      }

      container.innerHTML = content;
    }, 100);

    const observer = new MutationObserver(callback);

    container.style.opacity = 0;
    container.style.position = 'fixed';
    container.style['pointer-events'] = 'none';
    contextDocument.body.appendChild(container);

    callback();
    observer.observe(document.head, config);
    observer.observe(document.body, config);

    return () => observer.disconnect();
  }, [contextDocument]);

  useEffect(() => {
    if (contextWindow !== window) {
      dragDropManager.getBackend().addEventListeners(contextWindow);
      return () => dragDropManager.getBackend().removeEventListeners(contextWindow);
    }
  }, [contextWindow, dragDropManager]);

  return children;
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
