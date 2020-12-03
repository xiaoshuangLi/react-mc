# `react-mc-dnd`

An easy way to use [react-dnd](https://github.com/react-dnd/react-dnd).

[List Demo](https://codesandbox.io/s/react-mc-dnd-list-t974t)

[Group Demo](https://codesandbox.io/s/react-mc-dnd-group-s2smm)

[Paint Demo](https://codesandbox.io/s/react-mc-dnd-paint-z5hky)

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-dnd

## Usage

```jsx
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {
  ConfigContext,
  withContainer,
  withDrag,
  withDrop,
  withDragAndDrop,
  withDragAndHover,
  useContainer,
  useDrag,
  useDrop,
  useDragAndDrop,
  useDragAndHover,
} from 'react-mc-dnd';

const { Provider: ConfigProvider } = ConfigContext;

const value = {
  dummy: false,
  isInChildren: (parentData, dragData, monitor) => false,
  onDrop: (dom, parentData, monitor) => {},
  onDragEnd: (dom, dargData, monitor) => {},
  onDragHover: (targetInfo, dargData, monitor) => {},
  onRender: (dom, data, monitor) => {},
};

/**
 * "container", "content" name what ever you like.
 */
const Div = withDragAndDrop('div', 'container');
const Input = withDragAndHover('input', 'content');

const App = (props = {}) => {
  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <ConfigProvider value={value}>
        {/* something to render */}
      </ConfigProvider>
    </DndProvider>
  );
};

export default App;
```

## ConfigContext

Defined configuration to handle dnd events.

#### dummy: bool

If ```true```, disable all dom events;

#### isInChildren: func

Return ```true``` means ```dargData``` is ```parentData``` descendant, not just children.

## withContainer/useContainer

```jsx
const data;

withContainer('div', data);
useContainer(ref, data);
```

## withDrop/useDrop

Will trigger ```onDrop```, ```onDragHover```.

```jsx
const targetInfo = {
  parentData: {}, // object
  parentRelationKeys: [], // array
  data: {}, // object
  offset: [], // number, relative offset for data index
};

withDrop('div', targetInfo);
useDrop(ref, targetInfo);
```

## withDragAndDrop/useDragAndDrop

Will trigger ```onDrop```, ```onDragEnd```, ```onDragHover```, ```onRender```.

```jsx
const data;

withDragAndDrop('div', data);
useDragAndDrop(ref, data);
```

## withDragAndHover/useDragAndHover

Will trigger ```onDrop```, ```onDragEnd```, ```onDragHover```, ```onRender```.

```jsx
const data;

withDragAndHover('div', data);
useDragAndHover(ref, data);
```
