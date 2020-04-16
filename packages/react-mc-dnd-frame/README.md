# `react-mc-dnd-frame`

Make [react-dnd](https://github.com/react-dnd/react-dnd) work for ```iframe```.

[Documentation](https://github.com/xiaoshuangLi/react-mc-documentation/tree/master/packages/react-mc-dnd-frame#readme)

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