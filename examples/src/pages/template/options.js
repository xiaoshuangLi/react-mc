import * as buildInComponents from '../../buildInComponents';

export const getComponentClass = (component = {}) => {
  const { name } = component;
  const { [name]: ComponentClass } = buildInComponents;

  if (ComponentClass) {
    return ComponentClass;
  }

  if (/^[a-z]+$/.test(name)) {
    return name;
  }

  return 'div';
};

export const getComponentPropsSchema = (component = {}) => {
  const ComponentClass = getComponentClass(component) || 'div';
  const { __docgenInfo: { propsSchema } = {} } = ComponentClass;

  return propsSchema;
};

export default {
  getComponentClass,
  getComponentPropsSchema,
};
