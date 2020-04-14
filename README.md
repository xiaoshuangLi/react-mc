# react-mc

## Concept

The main concept is to render ```value```, maybe modify when we need to. Render it in right way, you'll see the webpage you built with no code. And if you konw the data structure of ```value```, you can modify it to whatever you want.

This ```value``` consists of ```component```, not the other thing we use in [react](https://github.com/facebook/react). It's an object to save data.

```js
/**
 *  component example
 *  
 *  id: String, should be unique.
 *  name: String, use to determine the ComponentClass we render.
 *  props: Object, the props for ComponentClass to render with.
 *
 */
const component = {
  id: 'compoent-1',
  name: 'div',
  props: {
    style: {
      color: 'red',
    },
  },
};
```

```js
/**
 *  value example
 *  
 *  componentMap: Object, stor all components data,key means the id of component,value means the data of component.
 *  relationMap: Object, store the association between components,key means the id of component.
 *  rootComponentIds: Array, means the components you render for root.
 *
 */
const value = {
  componentMap: {
    'parent-1': {
      id: 'parent-1',
      name: 'div',
      props: {
        style: {
          fontSize: '14px',
        },
      },
    },
    'parent-2': {
      id: 'parent-1',
      name: 'div',
      props: {
        style: {
          fontSize: '14px',
        },
      },
    },
    'child-1-1': {
      id: 'child-1-1',
      name: 'div',
      props: {
        style: {
          padding: 10,
          backgroundColor: 'red',
        },
      },
    },
    'child-1-2': {
      id: 'child-1-2',
      name: 'div',
    },
    'child-2-1': {
      id: 'child-1-2',
      name: 'div',
    },
    'child-2-2': {
      id: 'child-1-2',
      name: 'div',
    },
  },
  relationMap: {
    'parent-1': {
      children: ['child-1-1', 'child-1-2'],
    },
    'parent-2': {
      children: ['child-2-1', 'child-2-2'],
    },
  },
  rootComponentIds: ['parent-1', 'parent-2'],
};
```

## Packages

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). That means that we actually publish [several packages](/packages) to npm from the same codebase, including:

| Package                                                | Docs                                                                                                                                                                                                                                                                          | Description                                                                        |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`react-mc-render`](/packages/react-mc-render)               | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](/packages/react-mc-render)          | Render the ```value``` we got. |
| [`react-mc-template`](/packages/react-mc-template)               | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](/packages/react-mc-template)          | Render the ```value``` we got and modify if we want. |
| [`react-mc-runner`](/packages/react-mc-runner)               | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](/packages/react-mc-runner)          | Render the ```value``` we got and bound the events. |
| [`react-mc-dnd`](/packages/react-mc-dnd)               | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](/packages/react-mc-dnd)          | An easy way to use [react-dnd](https://github.com/react-dnd/react-dnd). |
| [`react-mc-dnd-fram`](/packages/react-mc-dnd-fram)               | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](/packages/react-mc-dnd-fram)          | Make [react-dnd](https://github.com/react-dnd/react-dnd) work for ```iframe``` |
