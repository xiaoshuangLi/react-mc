import React from 'react';

export const isRoot = (component = {}) => false;

export const getComponentClass = (component = {}) => {
  const { name } = component;

  return /^[a-z]+$/.test(name) ? name : 'div';
};

export const getComponentRenderDependencies = (...args) => args;

export const getComponentPropsSchema = (component = {}) => ({});

export const getComponentChildrenKeys = (component = {}) => {
  const { name } = component;

  return name === 'div'
    ? ['children']
    : undefined;
};

export const render = (ComponentClass = 'div', component = {}) => (props = {}, ref) => {
  return (
    <ComponentClass ref={ref} {...props} />
  );
};

export default {
  isRoot,
  getComponentClass,
  getComponentRenderDependencies,
  getComponentPropsSchema,
  getComponentChildrenKeys,
  render,
};
