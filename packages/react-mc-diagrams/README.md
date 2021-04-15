# `react-mc-diagrams`

This is a React library for drawing diagrams easily. What we can do:
* **Draw line:** Just render dots with id, we will draw line between them.
* **Move element:** Just render ```Component``` under ```Movable```, we will trigger ```onMove``` when you drag them.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-diagrams

## Usage

```jsx
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Diagrams, { Dot, Movable } from 'react-mc-diagrams';

const style = {
  padding: '5px 10px',
  backgroundColor: 'rgba(0, 0, 0, .2)',
};

const initialStars = [
  { id: '1', style, position: { left: 130, top: 350 } },
  { id: '2', style, position: { left: 315, top: 255 } },
  { id: '3', style, position: { left: 440, top: 275 } },
  { id: '4', style, position: { left: 610, top: 316 } },
  { id: '5', style, position: { left: 690, top: 440 } },
  { id: '6', style, position: { left: 920, top: 370 } },
  { id: '7', style, position: { left: 900, top: 200 } },
];

const initialValue = [
  { source: '1-dot', target: '2-dot' },
  { source: '2-dot', target: '3-dot' },
  { source: '3-dot', target: '4-dot' },
  { source: '4-dot', target: '5-dot' },
  { source: '5-dot', target: '6-dot' },
  { source: '6-dot', target: '7-dot' },
];

const App = () => {
  const [stars = [], setStars] = useState(initialStars);
  const [value = [], setValue] = useState(initialValue);

  const onMove = (nextStar = {}) => {
    setStars((prevStars = []) => {
      return prevStars.map((prevStar = {}) => {
        const { id: prevStarId } = prevStar;
        const { id: nextStarId } = nextStar;

        return prevStarId === nextStarId
          ? { ...prevStar, ...nextStar }
          : prevStar;
      });
    });
  };

  const items = stars.map((item = {}, index) => {
    const { id } = item;

    const dotId = `${id}-dot`;

    return (
      <Movable key={index} {...item}>
        <Dot id={dotId} />
      </Movable>
    );
  });

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <Diagrams value={value} onMove={onMove} onChange={setValue}>
        { items }
      </Diagrams>
    </DndProvider>
  );
};

export default App;
```

## Documentation

### Diagrams

#### Diagrams.value: array

Define the lines between dots.

```js
const [current = {}] = value;

const {
  /**
   * True mean we selected this line.
   */
  active = false,
  /**
   * Offset bigger, line more curved.
   *
   * Been useful when two lines have same target and source.
   */
  offset = 0,
  source = 'source-dot-id',
  target = 'target-dot-id',
} = current;
````

#### Diagrams.onChange: func

Trigger it when ```value``` been changed.

#### Diagrams.onMove: func

Trigger it when ```<Movable id="movable-id" />``` was dragged.

```jsx
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Diagrams, { Movable } from 'react-mc-diagrams';

const initialState = {
  id: 'movable-id',
  position: { top: 100, left: 100 },
  children: 'movable-content',
};

const App = () => {
  const [state = {}, setState] = useState(initialState);

  const onMove = (current = {}) => {
    const { id = 'movable-id', position = {} } = current;
    const { top = 0, left = 0 } = position;

    setState({ ...state, ...current });
  };

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <Diagrams onMove={onMove}>
        <Movable {...state} />
      </Diagrams>
    </DndProvider>
  );
};

export default App;
```

#### Diagrams.onDrop: func

Trigger it when drop something.

### Dot

Define dot under ```<Diagrams />```.

#### Dot.id: string

*Required*  *Unique*

The ```source``` and ```target``` in ```Diagrams.value``` are ```id``` from ```Dot```.

### Movable

Make element movable undeer ```<Diagrams />```.

#### Movable.id: string

*Required*  *Unique*

#### Movable.position: object

```jsx
const { top = 0, left = 0 } = position;
```

#### Movable.children: node

Render whatever you want.
