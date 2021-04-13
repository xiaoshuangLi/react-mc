import React, {
  useEffect,
  useContext,
} from 'react';
import classnames from 'classnames';

import { withDrop } from 'react-mc-dnd';

import { CanvasContext, useStableRef } from './utils/hooks';

let empty;

const getEmpty = () => {
  if (!empty) {
    empty = new Image();
    empty.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  return empty;
};

const Canvas = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const { className, ...others } = props;

  const cls = classnames({
    'canvas-render': true,
    [className]: !!className,
  });

  const [, setCanvas] = useContext(CanvasContext);

  useEffect(
    () => setCanvas(ref.current),
    [ref, setCanvas],
  );

  useEffect(() => {
    const { current } = ref;

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
  }, [ref]);

  return (
    <div ref={ref} className={cls} {...others} />
  );
});

export default withDrop(Canvas);
