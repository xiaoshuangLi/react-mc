# `react-mc-runner`

Render the ```value``` we got and modify if we want.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-runner

## Usage

```jsx
import React, { useState } from 'react';

import ReactMCRunner from 'react-mc-runner';

/**
 * In this case,
 * will only render some "div" with different id.
 * Because we have not set up options.getComponentClass.
 */
const App = (props = {}) => {
  const [value = {}, setValue] = useState({});

  return (
    <ReactMCRunner
      value={value}
      onChange={setValue}
    />
  );
};

export default App;
```

## props.value: object

The ```value``` you can render. 

[Detail for value](https://github.com/xiaoshuangLi/react-mc#concept);

## props.onChange: func

Trigger it when ```value``` was changed.

## props.options: object

The parameters you need to configure to render ```value``` in the way you want.

```jsx
const options = {
  getComponentClass: (component = {}) => 'div',
  getComponentRenderDependencies: (component = {}) => [],
  getComponentPropsSchema: (component = {}) => ({}),
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

#### options.getComponentPropsSchema

We use [PropsSchema](https://github.com/xiaoshuangLi/react-docgen-props-schema) to define [PropTypes](https://github.com/facebook/prop-types).
For webpack, you can add a plugin to ```babel``` to generate automatically.

[Base on JSONSchema](https://json-schema.org)

[Webpack example](https://github.com/xiaoshuangLi/react-mc/blob/master/examples/webpack.config.js)

#### options.render

The final touch to render ```component``` correctly.This function is useful when you want to do something nasty.

```jsx
import { findDOMNode } from 'react-dom';

/**
 * ComponentClass: elementType, is what getComponentClass return
 * props: object, base on component.props, relation and bound events.
 */
const render = (ComponentClass, component = {}) => (props = {}, ref) => {
  const { current } = ref;
  const dom = findDOMNode(current);

  return (
    <ComponentClass ref={ref} {...props} />
  );
};
```