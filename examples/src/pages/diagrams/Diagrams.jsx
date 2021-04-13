import React, { useState } from 'react';
import classnames from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ReactMCDiagrams, {
  Dot,
  Movable,
} from 'react-mc-diagrams';

const initialList = [
  { id: '1', position: { top: 100, left: 100 } },
  { id: '2', position: { top: 200, left: 700 } },
  { id: '3', position: { top: 500, left: 400 } },
];

const initialValue = [
  { source: '1-dot', target: '2-dot' },
  { source: '1-dot', target: '2-dot', offset: 1 },
];

const Diagrams = React.forwardRef((props = {}, ref) => {
  const { className } = props;

  const cls = classnames({
    'components-diagrams-render': true,
    [className]: !!className,
  });

  const [list = [], setList] = useState(initialList);
  const [value = [], setValue] = useState(initialValue);

  const onMove = (current = {}) => {
    setList((prevList = {}) => {
      return prevList.map((prevItem = {}) => {
        const { id: prevItemId } = prevItem;
        const { id: currentId } = current;

        return prevItemId === currentId
          ? { ...prevItem, ...current }
          : prevItem;
      });
    });
  };

  const items = list.map((item = {}, index) => {
    const { id } = item;

    const dotId = `${id}-dot`;

    return (
      <Movable className="rect" key={index} {...item}>
        <Dot id={dotId} />
      </Movable>
    );
  });

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <ReactMCDiagrams
        ref={ref}
        className={cls}
        value={value}
        onMove={onMove}
        onChange={setValue}
      >
        { items }
      </ReactMCDiagrams>
    </DndProvider>
  );
});

export default Diagrams;
