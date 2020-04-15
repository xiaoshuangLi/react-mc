# `react-mc-dnd-frame`

Render the ```value``` we got and modify if we want.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-dnd-frame

## Usage

```jsx
import React, { useContext } from 'react';
import { FrameContext } from 'react-frame-component';

import Frame from 'react-mc-dnd-frame';

const Content = (props = {}) => {
  const context = useContext(FrameContext);

  const {
    document: contextDocument = document,
    window: contextWindow = window,
  } = context;

  return (
    <div className="content" {...props} />
  );
};

/**
 * In this case,
 * will only render some "div" with different id.
 * Because we have not set up options.getComponentClass.
 */
const App = (props = {}) => {
  const [value = {}, setValue] = useState({});

  return (
    <Frame className="app-frame">
      <Content>content</Content>
    </Frame>
  );
};

export default App;
```