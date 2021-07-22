import React, {
  useMemo,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { CollectionsContext, withMode } from './utils/hooks';

const useDefinition = (props = {}) => {
  const { type: propsType } = props;

  const [collections] = useContext(CollectionsContext);

  return useMemo(() => {
    if (!collections) {
      return;
    }

    if (!propsType) {
      return;
    }

    for (let v = 0; v < collections.length; v += 1) {
      const collection = collections[v] || {};
      const { definitions = [] } = collection;

      for (let i = 0; i < definitions.length; i += 1) {
        const definition = definitions[i] || {};
        const { type } = definition;

        if (propsType === type) {
          return definition;
        }
      }
    }
  }, [propsType, collections]);
};

const Creation = React.forwardRef((props = {}, ref) => {
  const definition = useDefinition(props) || {};
  const { ComponentClass } = definition;

  if (!ComponentClass) {
    return null;
  }

  return (
    <ComponentClass ref={ref} {...props} />
  );
});

Creation.propTypes = {
  type: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.any,
  ),
  onChange: PropTypes.func,
};

Creation.defaultProps = {
  type: '',
  value: [],
  onChange: undefined,
};

export default withMode(Creation);
