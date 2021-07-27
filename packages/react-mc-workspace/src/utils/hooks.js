import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';

/**
 * const Definition = {
 *   type: 'component_value',
 *   output: true,
 *   ComponentClass: 'div',
 * };
 *
 * const Collection = {
 *   type: 'local_data',
 *   title: '',
 *   definitions: [Definition],
 * };
 *
 * const Extraction = {
 *   ComponentClass: Selector,
 *   props: { ... },
 * };
 */

export const CollectionsContext = createContext([]);

export const DefinitionsContext = createContext([]);

export const CallbacksContext = createContext({});

export const StateContext = createContext([]);

export const ModeContext = createContext();

export const DefaultModeContext = createContext();

export const ExtractionsContext = createContext([]);

export const ExtractableContext = createContext(false);

export const useUsing = (initialState) => {
  const using = useState(initialState);

  return useMemo(() => using, using);
};

export const useArgument = (props = {}) => {
  const { appendArgument } = useContext(CallbacksContext);

  useEffect(() => {
    appendArgument && appendArgument(props);
  }, []);
};

export const useDecoration = (props = {}) => {
  const { appendDecoration } = useContext(CallbacksContext);

  useEffect(() => {
    appendDecoration && appendDecoration(props);
  }, []);
};

export const useMode = () => {
  const mode = useContext(ModeContext);
  const defaultMode = useContext(DefaultModeContext);

  return useMemo(() => {
    return mode === undefined
      ? defaultMode
      : mode;
  }, [mode, defaultMode]);
};

const { Provider: ModeProvider } = ModeContext;

export const withMode = (ComponentClass) => React.forwardRef((props = {}, ref) => {
  const { mode, ...others } = props;

  if (mode !== undefined) {
    return (
      <ModeProvider value={mode}>
        <ComponentClass ref={ref} {...others} />
      </ModeProvider>
    );
  }

  return (
    <ComponentClass ref={ref} {...others} />
  );
});

export const withExtraction = (ComponentClass) => React.forwardRef((props = {}, ref) => {
  const { children, ...others } = props;

  const extractable = useContext(ExtractableContext);
  const [extractions, setExtractions] = useContext(ExtractionsContext);

  const denpencies = Object.values(others);
  const extraction = useMemo(() => {
    return { ComponentClass, props: others };
  }, denpencies);

  const more = useMemo(() => {
    if (extractable) {
      return {};
    }

    if (!extractions) {
      return {};
    }

    const found = extractions.find(
      (item = {}) => item.ComponentClass === ComponentClass,
    ) || {};

    return found.props || {};
  }, [extractable, extractions]);

  useEffect(() => {
    if (!extractable) {
      return;
    }

    if (!setExtractions) {
      return;
    }

    setExtractions((prevExtractions = []) => {
      return prevExtractions.concat(extraction);
    });

    return () => {
      setExtractions((prevExtractions = []) => {
        const included = prevExtractions.includes(extraction);

        if (included) {
          return prevExtractions.filter(
            (item) => item !== extraction,
          );
        }

        return prevExtractions;
      });
    };
  }, [extractable, setExtractions, extraction]);

  if (extractable) {
    return null;
  }

  return (
    <ComponentClass ref={ref} {...props} {...more} />
  );
});
