import {
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

export const CreationsContext = createContext([]);

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
