import {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';

import {
  useEventCallback,
  useThrottleCallback,
} from 'shared/hooks';

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

const some = (source, target) => {
  if (!source) {
    return source === target;
  }

  if (typeof source !== 'object') {
    return source === target;
  }

  const values = Object.values(source);

  return values.some((value) => {
    return value === target || some(value, target);
  });
};

const filter = (source, target) => {
  if (!source) {
    return source;
  }

  if (typeof source !== 'object') {
    return source;
  }

  const arraied = Array.isArray(source);

  if (arraied) {
    return source.reduce((res = [], item, index) => {
      if (item === target) {
        res = res.slice();
        res.splice(index, 1);
        return res;
      }

      const current = filter(item, target);

      if (item !== current) {
        res = res.slice();
        res.splice(index, 1, current);
      }

      return res;
    }, source);
  }

  const entries = Object.entries(source);

  return entries.reduce((res = {}, entry = []) => {
    const [key, value] = entry;
    const { [key]: a, ...rest } = res;

    if (value === target) {
      return rest;
    }

    const current = filter(value, target);

    if (value !== current) {
      res = { ...res, [key]: current };
    }

    return res;
  }, source);
};

const belong = (source, target) => {
  if (!source) {
    return;
  }

  if (typeof source !== 'object') {
    return;
  }

  const arraied = Array.isArray(source);

  if (arraied) {
    for (let v = 0; v < source.length; v += 1) {
      const current = source[v];

      if (current === target) {
        return source;
      }

      const owner = belong(current, target);

      if (owner) {
        return owner;
      }
    }
  }

  const values = Object.values(source);

  for (let v = 0; v < values.length; v += 1) {
    const value = values[v];
    const owner = belong(value, target);

    if (owner) {
      return owner;
    }
  }
};

const replace = (source) => (target, final) => {
  if (!source) {
    return source;
  }

  if (typeof source !== 'object') {
    return source;
  }

  if (source === target) {
    return final;
  }

  const arraied = Array.isArray(source);

  if (arraied) {
    return source.reduce((res = [], item, index) => {
      if (item === target) {
        res = res.slice();
        res.splice(index, 1, final);
        return res;
      }

      const current = replace(item)(target, final);

      if (item !== current) {
        res = res.slice();
        res.splice(index, 1, current);
      }

      return res;
    }, source);
  }

  const entries = Object.entries(source);

  return entries.reduce((res = {}, entry = []) => {
    const [key, value] = entry;

    if (value === target) {
      return { ...res, [key]: final };
    }

    const current = replace(value)(target, final);

    if (value !== current) {
      res = { ...res, [key]: current };
    }

    return res;
  }, source);
};

export const useDndValue = (props = {}) => {
  const { value = [], onChange } = props;

  const isInChildren = useEventCallback((parent = {}, child = {}) => {
    const { creation: parentCreation } = parent;
    const { creation: childCreation } = child;

    return some(parentCreation, childCreation);
  });

  const onDragHover = useThrottleCallback((targetInfo = {}, dragData = {}) => {
    const {
      data: targetData,
      offset: targetOffset,
    } = targetInfo;

    const { creation: targetCreation } = targetData;
    const { creation: dragCreation } = dragData;

    let nextValue = filter(value, dragCreation);
    const owner = belong(nextValue, targetCreation);

    if (!owner) {
      return;
    }

    const nextOwner = owner.slice();
    const index = owner.indexOf(targetCreation);
    const position = index + targetOffset;

    nextOwner.splice(position, 0, dragCreation);
    nextValue = replace(nextValue)(owner, nextOwner);

    if (nextValue === value) {
      return;
    }

    onChange && onChange(nextValue);
  }, 180, { trailing: false });

  return useMemo(
    () => ({ custom: true, isInChildren, onDragHover }),
    [isInChildren, onDragHover],
  );
};
