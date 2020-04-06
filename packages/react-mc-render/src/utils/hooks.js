import {
  useContext,
  createContext,
} from 'react';

import defaultOptions from './options';

export const RenderContext = createContext({});

export const useOptionsFromProps = (props = {}) => {
  const { options = {} } = props;

  return { ...defaultOptions, ...options };
};

export const useOptionsFromContext = () => {
  const context = useContext(RenderContext);
  const { options } = context;

  return { ...defaultOptions, ...options };
};
