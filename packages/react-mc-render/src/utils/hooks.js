import {
  memo,
  useContext,
  createContext,
} from 'react';

import { isSame } from 'shared/array';
import { useEventCallback } from 'shared/hooks';

import defaultOptions from './options';

export const RenderContext = createContext({});

export const renderByMemo = (Comp, getDependencies) => {
  if (getDependencies === undefined) {
    return memo(Comp);
  }

  return memo(Comp, (prevProps, nextProps = {}) => {
    const prevDependencies = getDependencies(prevProps) || [];
    const nextDependencies = getDependencies(nextProps) || [];

    return isSame(prevDependencies, nextDependencies);
  });
};

export const useOptionsFromProps = (props = {}) => {
  const { options = {} } = props;

  return { ...defaultOptions, ...options };
};

export const useOptionsFromContext = () => {
  const context = useContext(RenderContext);
  const { options } = context;

  return { ...defaultOptions, ...options };
};

export const useGetDependencies = (options = {}) => {
  const { getComponentRenderDependencies } = options;

  return useEventCallback((props = {}) => {
    const { componentId, ...context } = props;
    const { value = {} } = context;
    const { componentMap = {}, relationMap = {} } = value;

    const component = componentMap[componentId];
    const relation = relationMap[componentId];
    const dependencies = getComponentRenderDependencies(component, context) || [];

    return [component, relation, ...dependencies];
  });
};
