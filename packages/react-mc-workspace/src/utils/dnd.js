import React, {
  useMemo,
  useContext,
  createRef,
  PureComponent,
} from 'react';
import { DndContext } from 'react-dnd';

import {
  useEventCallback,
  useThrottleCallback,
} from 'shared/hooks';

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

class Refer extends PureComponent {
  render() {
    return this.props.children;
  }
}

export const createDndContainer = (useDndHook) => React.forwardRef((props = {}, ref) => {
  const { creation } = props;

  ref = useMemo(() => {
    return ref || createRef(null);
  }, [ref]);

  const { dragDropManager } = useContext(DndContext);

  const data = useMemo(() => {
    return { id: creation, creation };
  }, [creation]);

  // eslint-disable-next-line
  dragDropManager && useDndHook(ref, data);

  return (
    <Refer ref={ref} {...props} />
  );
});
