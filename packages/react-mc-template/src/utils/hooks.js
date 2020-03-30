import React, {
  useMemo,
  useEffect,
  forwardRef,
} from 'react';
import { findDOMNode } from 'react-dom';

import {
  useDragAndHover,
  useDragAndDrop,
} from 'react-mc-dnd';

import memoize from 'shared/memoize';
import Highlight from 'shared/Highlight';
import {
  useEventCallback,
  useThrottleCallback,
} from 'shared/hooks';

import Core from './Core';
import defaultOptions from './options';

const findRookie = (prevTemplate = {}, nextTemplate = {}) => {
  const { componentMap: prevComponentMap = {} } = prevTemplate;
  const { componentMap: nextComponentMap = {} } = nextTemplate;

  const nextComponents = Object.values(nextComponentMap);

  return nextComponents.find((component = {}) => {
    const { id: componentId } = component;

    return prevComponentMap[componentId] === undefined;
  });
};

const withDragAndHover = memoize((ComponentClass) => forwardRef((props = {}, ref) => {
  const { __component: data = {}, ...others } = props;

  useDragAndHover(ref, data);

  return (
    <ComponentClass ref={ref} {...others} />
  );
}));

const withDragAndDrop = memoize((ComponentClass) => forwardRef((props = {}, ref) => {
  const { __component: data = {}, ...others } = props;

  useDragAndDrop(ref, data);

  return (
    <ComponentClass ref={ref} {...others} />
  );
}));

export const useOptions = (props = {}) => {
  const { options: propsOptions = {} } = props;

  const options = {
    ...defaultOptions,
    ...propsOptions,
  };

  const {
    getComponentClass,
    getComponentChildrenKeys,
    render,
  } = options;

  const denpendencies = Object.values(options);

  return useMemo(
    () => ({
      ...options,
      getComponentClass: (component = {}) => {
        const ComponentClass = getComponentClass(component) || 'div';
        const childrenKeys = getComponentChildrenKeys(component) || [];
        const HOC = childrenKeys.length ? withDragAndDrop : withDragAndHover;

        return HOC(ComponentClass);
      },
      getComponentRenderDependencies: (component = {}, context = {}) => {
        const { selectedComponent = {} } = context;
        const { id: selectedComponentId } = selectedComponent;
        const { id: componentId } = component;

        const selected = selectedComponentId === componentId;

        return [selected];
      },
      render: (ComponentClass, component) => (renderProps = {}, ref) => {
        renderProps = { ...renderProps, __component: component };

        return render(ComponentClass, component)(renderProps, ref);
      },
    }),
    denpendencies,
  );
};

export const useCore = (props = {}) => {
  const options = useOptions(props) || {};

  return useMemo(
    () => new Core(options),
    [options],
  );
};

export const useDndValue = (props = {}) => {
  const {
    value: propsValue = {},
    selectedComponent: propsSelectedComponent = {},
    onChange = () => {},
    onSelectComponent = () => {},
  } = props;

  const core = useCore(props);
  const highlight = useMemo(
    () => new Highlight(),
    [],
  );

  const isInChildren = useEventCallback(
    core.isInChildren(propsValue),
  );

  const onDragHover = useThrottleCallback((targetInfo = {}, component = {}) => {
    let value = core.cutComponent(propsValue)(component);
    value = core.appendComponent(value)(targetInfo, component);

    const rookie = findRookie(propsValue, value);

    onChange(value);
    rookie && onSelectComponent(rookie);
  }, 180, { trailing: false });

  const onClick = useEventCallback((dom, component = {}) => {
    const { id: componentId } = component;

    componentId && onSelectComponent(component);
  });

  const onDragEnd = useEventCallback((dom, component = {}) => {
    const { id: componentId } = component;

    componentId && onSelectComponent(component);
  });

  const onRender = useEventCallback((dom, component = {}) => {
    const { id: selectedComponentId } = propsSelectedComponent;
    const { id: componentId } = component;

    selectedComponentId === componentId && highlight.render(dom);
  });

  return useMemo(() => ({
    dummy: true,
    isInChildren,
    onDragEnd,
    onDragHover,
    onRender,
    onClick,
  }), [isInChildren, onDragEnd, onDragHover, onClick, onRender]);
};

export const useTriggers = (props = {}, ref) => {
  const {
    value: propsValue = {},
    selectedComponent: propsSelectedComponent = {},
    onChange = () => {},
    onSelectComponent = () => {},
  } = props;

  const core = useCore(props);

  const listeners = [
    // 复制 cmd/ctrl c
    {
      metaOrCtrl: true,
      which: 67,
      fn: () => core.copyComponent(propsValue)(propsSelectedComponent),
    },
    // 剪切 cmd/ctrl x
    {
      metaOrCtrl: true,
      which: 88,
      fn: () => ({
        component: core.findClosestComponent(propsValue)(propsSelectedComponent),
        template: core.cutComponent(propsValue)(propsSelectedComponent),
      }),
    },
    // 黏贴 cmd/ctrl v
    {
      metaOrCtrl: true,
      which: 86,
      fn: () => ({
        template: core.pasteComponent(propsValue)(propsSelectedComponent),
      }),
    },
    // 选中父节点 左
    {
      which: 37,
      fn: () => {
        const parent = core.findParent(propsValue)(propsSelectedComponent);

        if (parent) {
          return { component: parent };
        }
      },
    },
    // 选中子节点 右
    {
      which: 39,
      fn: () => {
        const bastard = core.findBastard(propsValue)(propsSelectedComponent);

        if (bastard) {
          return { component: bastard };
        }
      },
    },
    // 选中平级上一个节点 上
    {
      which: 38,
      fn: () => ({
        component: core.findPrevComponent(propsValue)(propsSelectedComponent),
      }),
    },
    // 选中平级下一个节点 下
    {
      which: 40,
      fn: () => ({
        component: core.findNextComponent(propsValue)(propsSelectedComponent),
      }),
    },
    // 删除 del
    {
      which: 8,
      fn: () => ({
        component: core.findClosestComponent(propsValue)(propsSelectedComponent),
        template: core.removeComponent(propsValue)(propsSelectedComponent),
      }),
    },
  ];

  const onKeyDown = useEventCallback((e) => {
    const { current } = ref;

    if (!current) {
      return;
    }

    const container = findDOMNode(current);
    const hoveredElements = Array.from(document.querySelectorAll('*:hover'));
    const hovered = hoveredElements.includes(container);

    if (!hovered) {
      return;
    }

    const { metaKey, ctrlKey, which } = e;
    const metaOrCtrl = metaKey || ctrlKey;
    const obj = { metaOrCtrl, which };

    const listener = listeners.find((item = {}) => {
      const { fn, ...others } = item;
      const keys = Object.keys(others);

      return keys.every((key) => obj[key] === others[key]);
    }) || {};

    const { fn } = listener;
    const data = fn && fn();

    if (fn) {
      e.preventDefault();
    }

    if (data) {
      const { template, component } = data;

      template && onChange(template);
      component && onSelectComponent(component);
    }
  });

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onKeyDown, ref]);
};
