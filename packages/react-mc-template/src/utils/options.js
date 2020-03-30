import React from 'react';

export const isRoot = (component = {}) => false;

export const getComponentClass = (component = {}) => 'div';
export const getComponentRenderDependencies = (...args) => args;

export const getComponentPropsSchema = (component = {}) => ({});
export const getComponentChildrenKeys = (component = {}) => {
  if (component.name === 'div') {
    return ['children'];
  }

  const propsSchema = getComponentPropsSchema(component);
  const { properties = {} } = propsSchema;
  const { children: { type } = {} } = properties;

  return type === 'node' ? ['children'] : [];
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
