import React, { useState } from 'react';
import classnames from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ReactMCDiagrams, { Dot, Movable } from 'react-mc-diagrams';

const initialList = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
  { id: '6' },
  { id: '7' },
  { id: '8' },
  { id: '9' },
  { id: '10' },
  { id: '11' },
  { id: '12' },
  { id: '13' },
  { id: '14' },
  { id: '15' },
  { id: '16' },
  { id: '17' },
  { id: '18' },
  { id: '19' },
  { id: '20' },
  { id: '21' },
  { id: '22' },
  { id: '23' },
  { id: '24' },
  { id: '25' },
  { id: '26' },
  { id: '27' },
  { id: '28' },
  { id: '29' },
  { id: '30' },
  { id: '31' },
  { id: '32' },
  { id: '33' },
  { id: '34' },
  { id: '35' },
  { id: '36' },
  { id: '37' },
  { id: '38' },
  { id: '39' },
  { id: '40' },
  { id: '41' },
  { id: '42' },
  { id: '43' },
  { id: '44' },
  { id: '45' },
  { id: '46' },
  { id: '47' },
  { id: '48' },
  { id: '49' },
  { id: '50' },
];

const initialValue = [];

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
