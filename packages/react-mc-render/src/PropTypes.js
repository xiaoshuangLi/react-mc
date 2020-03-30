import PropTypes from 'prop-types';

const optionsType = PropTypes.shape({
  getComponentClass: PropTypes.func,
  getComponentRenderDependencies: PropTypes.func,
  render: PropTypes.func,
});

const componentType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  props: PropTypes.object,
});

const value = PropTypes.shape({
  rootComponentIds: PropTypes.arrayOf(PropTypes.string),
  componentMap: PropTypes.objectOf(componentType),
  relationMap: PropTypes.object,
});

export default {
  options: optionsType,
  value,
};
