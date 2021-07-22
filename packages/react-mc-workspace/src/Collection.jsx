import React, {
  useMemo,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import {
  CollectionsContext,
  DefinitionsContext,
  useUsing,
} from './utils/hooks';

const { Provider: DefinitionsProvider } = DefinitionsContext;

const isUseful = (collection = {}) => {
  const { root, type, definitions = [] } = collection;

  const necessary = root || !!type;
  const satisfied = !!definitions.length;

  return necessary && satisfied;
};

const Collection = React.forwardRef((props = {}, ref) => {
  const { children, ...others } = props;

  const [, setCollections] = useContext(CollectionsContext);

  const definitionsValue = useUsing([]);
  const [definitions] = definitionsValue;

  const denpencies = Object.values(others);
  const current = useMemo(() => others, denpencies);

  const collection = useMemo(() => {
    return { ...current, definitions };
  }, [current, definitions]);

  useEffect(() => {
    const useful = isUseful(collection);

    if (useful) {
      setCollections((prevCollections = []) => {
        return prevCollections.concat(collection);
      });
    }

    return () => {
      setCollections((prevCollections = []) => {
        const included = prevCollections.includes(collection);

        if (included) {
          return prevCollections.filter(
            (item) => item !== collection,
          );
        }

        return prevCollections;
      });
    };
  }, [collection, setCollections]);

  return (
    <DefinitionsProvider value={definitionsValue}>
      { children }
    </DefinitionsProvider>
  );
});

Collection.propTypes = {
  root: PropTypes.bool,
  type: PropTypes.string,
  title: PropTypes.string,
};

Collection.defaultProps = {
  root: false,
  type: '',
  title: '',
};

export default Collection;
