import PropTypes from 'prop-types';

const componentType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  props: PropTypes.object,
});

export default {
  options: PropTypes.shape({
    getComponentClass: PropTypes.func,
    getComponentPropsSchema: PropTypes.func,
    getComponentRenderDependencies: PropTypes.func,
    render: PropTypes.func,
  }),
  value: PropTypes.shape({
    rootComponentIds: PropTypes.arrayOf(PropTypes.string),
    componentMap: PropTypes.objectOf(componentType),
    relationMap: PropTypes.object,
  }),
  setValue: PropTypes.func,
};
