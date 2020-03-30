import PropTypes from 'prop-types';

const componentType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  props: PropTypes.object,
});

export default {
  options: PropTypes.shape({
    isRoot: PropTypes.func,
    getComponentClass: PropTypes.func,
    getComponentPropsSchema: PropTypes.func,
    getComponentChildrenKeys: PropTypes.func,
    getComponentRenderDependencies: PropTypes.func,
    render: PropTypes.func,
  }),
  value: PropTypes.shape({
    rootComponentIds: PropTypes.arrayOf(PropTypes.string),
    componentMap: PropTypes.objectOf(componentType),
    relationMap: PropTypes.object,
  }),
  selectedComponent: componentType,
  onChange: PropTypes.func,
  onSelectComponent: PropTypes.func,
};
