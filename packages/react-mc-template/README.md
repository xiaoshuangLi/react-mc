# `react-mc-template`

Render the ```value``` we got and modify if we want.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-mc-template

## Usage

```jsx
import React, { useState } from 'react';

import ReactMCTemplate, { Highlight, Core } from 'react-mc-template';

const core = new Core();
const highlight = new Highlight();

/**
 * In this case,
 * will only render some "div" with different id.
 * Because we have not set up options.getComponentClass.
 */
const App = (props = {}) => {
  const [value = {}, setValue] = useState({});
  const [selectedComponent = {}, setSelectedComponent] = useComponent({});

  return (
    <ReactMCTemplate
      core={core}
      highlight={highlight}
      value={value}
      selectedComponent={selectedComponent}
      onChange={setValue}
      onSelectComponent={setSelectedComponent}
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

## props.selectedComponent: object

The ```component``` you select.

## props.onSelectComponent: func

Trigger it when others were selected.

## props.document: dom

Set it to ```iframe.contentDocument``` you got when render in ```iframe```.

## props.body: dom

Set it to ```iframe.contentDocument.body``` you got when render in ```iframe```.

## props.highlight: object

Highlight when component are selected.

```jsx

import { Highlight } from 'react-mc-template';

const highlight = new Highlight();

const {
  mask,
  render, // (dom) => {}, run when select component
  clear, // () => {}, run when unmount 
} = highlight;

```

## props.core: object

Convenient operations for ```value```.

```jsx

import { Core } from 'react-mc-template';

const core = new Core();

/**
 * relationMap: { [componentId]: relation }
 */
const relation = {
  children: ['component-1', 'component-2'],
  list: [
    { content: 'component-3' },
    { content: 'component-4' },
  ],
};

/**
 * get three sets of relationKeys from relation
 */
const relationKeysGroup = [
 ['children'],
 ['list', 0, 'content'],
 ['list', 1, 'content']
];

const targetInfo = {
  parentData: {}, // object, parent compoent, default: rootComponent
  parentRelationKeys: [], // array, parent compoent relationKeys, only work when parentData set up
  data: {}, // object, component
  offset: [], // number, relative offset for component index, only work when data set up
};

const {
  getRootComponent, // (value) => component
  getRelation, // (value) => (component) => relation
  getRelationComponentIds, // (value) => (component, relationKeys = []) => [componentId];
  findParent, // (value) => (component) => component;
  findBastard, // (value) => (component) => component;
  findBelongRelationKeys, // (value) => (component) => [relationKey];
  findBelongRelationComponentIds, // (value) => (component) => [componentId];
  fintBelongComponentIds, // (value) => (component) => [componentId];
  findRelatedParentIds, // (value) => (component) => [componentId];
  findPrevComponent, // (value) => (component) => component;
  findNextComponent, // (value) => (component) => component;
  findClosestComponent, // (value) => (component) => component;
  isContainer, // (component) => bool
  isInChildren, // (value) => (component, component) => bool
  appendComponent, // (value) => (targetInfo, component) => value
  appendRelation, // (value) => (targetInfo, relation) => value
  removeComponent, // (value) => (component) => value
  copyComponent, // (value) => (component) => undefined
  pasteComponent, // (value) => (component) => value
  cutComponent, // (value) => (component) => value
} = core;
```

## props.options: object

The parameters you need to configure to render ```value``` in the way you want.

```jsx
const options = {
  isRoot: (component) => false,
  getComponentClass: (component = {}) => 'div',
  getComponentRenderDependencies: (component = {}) => [],
  getComponentPropsSchema: (component) => ({}),
  getComponentChildrenKeys: (component) => [],
  render: (ComponentClass, component = {}) => (props = {}, ref) => {
    return (
      <ComponentClass ref={ref} {...props} />
    );
  },
};
```

#### options.isRoot

Return the boolean means the ```component``` is root.If it's root, cannot been moved, copied or deleted;

#### options.getComponentClass

Return the ```ComponentClass``` to render the ```component```.And automatically used ```react-mc-dnd``` HOC.If you don't need this, use origin ```ComponentClass``` in ```options.render```.

We need ```ref``` for ```ComponentClass``` to get ```dom```.!!!

We need ```ref``` for ```ComponentClass``` to get ```dom```.!!!

We need ```ref``` for ```ComponentClass``` to get ```dom```.!!!

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

Ruturn the dependencies for rendering.The ```ComponentClass``` will render only if dependencies change.```component```, ```relation```, ```selected``` and ```childrenKeys``` are already in the dependencies by default.

```jsx
const visibleComponentIds = [];

// render when select the component
const getComponentRenderDependencies = (component = {}) => {
  const { id: componentId } = component;

  const visible = visibleComponentIds.included(componentId);

  return [visible];
};
```

#### options.getComponentPropsSchema

We use [PropsSchema](https://github.com/xiaoshuangLi/react-docgen-props-schema) to define [PropTypes](https://github.com/facebook/prop-types).
For webpack, you can add a plugin to ```babel``` to generate automatically.

[Base on JSONSchema](https://json-schema.org)

[Webpack example](https://github.com/xiaoshuangLi/react-mc/blob/master/examples/webpack.config.js)

#### options.getComponentChildrenKeys

The keys in relation we put when we drop something or paste to the ```component```.

```jsx
/**
 * childrenKeys for div
 *
 * ['children']
 */
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
