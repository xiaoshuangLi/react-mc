import React, {
  useRef,
  useEffect,
  useContext,
} from 'react';
import classnames from 'classnames';

import { useDrop } from 'react-mc-dnd';

import { CanvasContext } from './utils/hooks';

let empty;

const getEmpty = () => {
  if (!empty) {
    empty = new Image();
    empty.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  return empty;
};

const Canvas = React.forwardRef((props = {}, ref) => {
  const {
    className,
    onDragStart,
    onDragOver,
    onDragEnd,
    children,
    ...others
  } = props;

  const cls = classnames({
    'canvas-render': true,
    [className]: !!className,
  });

  const canvasRef = useRef(null);
  const [, setCanvas] = useContext(CanvasContext);

  useDrop(canvasRef);

  useEffect(
    () => setCanvas(canvasRef.current),
    [canvasRef, setCanvas],
  );

  useEffect(() => {
    const { current } = canvasRef;

    const listener = (e = {}) => {
      if (!current) {
        return;
      }

      if (typeof e.dataTransfer.setDragImage !== 'function') {
        return;
      }

      const { target } = e;

      const same = target === current;
      const contained = current.contains(target);
      const useful = same || contained;

      if (!useful) {
        return;
      }

      e.dataTransfer.setDragImage(getEmpty(), 0, 0);
    };

    const list = [window, document, document.body];

    list.forEach((item) => {
      item.addEventListener('dragstart', listener);
    });

    return () => {
      list.forEach((item) => {
        item.removeEventListener('dragstart', listener);
      });
    };
  }, [canvasRef]);

  return (
    <div ref={ref} className={cls} {...others}>
      <div
        className="canvas-container"
        ref={canvasRef}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        { children }
      </div>
    </div>
  );
});

export default Canvas;
