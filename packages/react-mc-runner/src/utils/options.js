import React from 'react';

export const getComponentClass = (component = {}) => {
  const { name } = component;

  return /^[a-z]+$/.test(name) ? name : 'div';
};

export const getComponentRenderDependencies = (...args) => args;

export const getComponentPropsSchema = (component = {}) => ({});

export const render = (ComponentClass = 'div', component = {}) => (props = {}, ref) => {
  return (
    <ComponentClass ref={ref} {...props} />
  );
};

export default {
  getComponentClass,
  getComponentRenderDependencies,
  getComponentPropsSchema,
  render,
};
