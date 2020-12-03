# `react-mc-render`

Render the ```value``` we got.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-render

## Usage

```jsx
import React from 'react';

import ReactMCRender from 'react-mc-render';

/**
 * In this case,
 * will only render some "div" with different id.
 * Because we have not set up options.getComponentClass.
 */
const App = (props = {}) => {
  const { value = {} } = props;

  return (
    <ReactMCRender value={value} />
  );
};

export default App;
```

## props.value: object

The ```value``` you can render.

[Detail for value](https://github.com/xiaoshuangLi/react-mc#concept);

## props.options: object

The parameters you need to configure to render ```value``` in the way you want.

```jsx
const options = {
  getComponentClass: (component = {}) => 'div',
  getComponentRenderDependencies: (component = {}) => [],
  render: (ComponentClass, component = {}) => (props = {}, ref) => {
    return (
      <ComponentClass ref={ref} {...props} />
    );
  },
};
```

#### options.getComponentClass

Return the ```ComponentClass``` to render the ```component```.

```jsx
import React from 'react';

const Input = React.forwardRef((props, ref) => {
  return 
});

const Text = React.forwardRef((props, ref) => {
  return <span ref={ref} {...props} />
});

const Img = React.forwardRef((props, ref) => {
  return <img ref={ref} {...props} />
});

const getComponentClass = (component = {}) => {
  const { name } = component;

  switch (name) {
    case 'input':
      return Input;
    case 'span':
      return Text;
    case 'img':
      return Img;
    default:
      return 'div';
  }
};
```

#### options.getComponentRenderDependencies

Ruturn the dependencies for rendering.The ```ComponentClass``` will render only if dependencies change.```component``` and ```relation``` are already in the dependencies by default.

```jsx
const selectedComponent = {};
const { id: selectedComponentId } = selectedComponent;

// render when select the component
const getComponentRenderDependencies = (component = {}) => {
  const { id: componentId } = component;

  const selected = selectedComponentId === componentId;

  return [selected];
};
```

#### options.render

The final touch to render ```component``` correctly.This function is useful when you want to do something nasty.

```jsx
import { findDOMNode } from 'react-dom';

/**
 * ComponentClass: elementType, is what getComponentClass return
 * props: object, base on component.props and relation.
 */
const render = (ComponentClass, component = {}) => (props = {}, ref) => {
  const { current } = ref;
  const dom = findDOMNode(current);

  return (
    <ComponentClass ref={ref} {...props} />
  );
};
```
