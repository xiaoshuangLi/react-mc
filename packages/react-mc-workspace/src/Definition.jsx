import React, {
  useMemo,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { DefinitionsContext } from './utils/hooks';

const isUseful = (definition = {}) => {
  const { type, ComponentClass } = definition;

  const necessary = !!type;
  const satisfied = !!ComponentClass;

  return necessary && satisfied;
};

const Definition = React.forwardRef((props = {}, ref) => {
  const { children, ...others } = props;

  const [, setDefinitions] = useContext(DefinitionsContext);

  const denpencies = Object.values(others);
  const definition = useMemo(() => others, denpencies);

  useEffect(() => {
    const useful = isUseful(definition);

    if (useful) {
      setDefinitions((prevDefinitions = []) => {
        return prevDefinitions.concat(definition);
      });
    }

    return () => {
      setDefinitions((prevDefinitions = []) => {
        const included = prevDefinitions.includes(definition);

        if (included) {
          return prevDefinitions.filter(
            (item) => item !== definition,
          );
        }

        return prevDefinitions;
      });
    };
  }, [definition, setDefinitions]);

  return null;
});

Definition.propTypes = {
  output: PropTypes.bool,
  type: PropTypes.string,
  ComponentClass: PropTypes.elementType,
};

Definition.defaultProps = {
  output: false,
  type: '',
  ComponentClass: undefined,
};

export default Definition;
