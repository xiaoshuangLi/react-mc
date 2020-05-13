import React, {
  useMemo,
  useEffect,
  useContext,
  forwardRef,
} from 'react';
import { findDOMNode } from 'react-dom';

import {
  ConfigContext,
  useContainer,
  useDragAndHover,
  useDragAndDrop,
} from 'react-mc-dnd';

import memoize from 'shared/memoize';
import { isSame } from 'shared/array';
import { findRelationKeysGroup } from 'shared/relation';
import {
  useEventCallback,
  useThrottleCallback,
} from 'shared/hooks';

import Core from './Core';
import Highlight from './Highlight';
import defaultOptions from './options';

const KEY = '__ReactMCTemplateRef';

const getKey = memoize((...args) => args);

const isSimilar = (prevTemplate = {}, nextTemplate = {}) => {
  const {
    rootComponentIds: prevRootComponentIds = [],
    relationMap: prevRelationMap = {},
  } = prevTemplate;

  const {
    rootComponentIds: nextRootComponentIds = [],
    relationMap: nextRelationMap = {},
  } = nextTemplate;

  const same = isSame(prevRootComponentIds, nextRootComponentIds);

  if (!same) {
    return false;
  }

  return JSON.stringify(prevRelationMap) === JSON.stringify(nextRelationMap);
};

const findRookie = (prevTemplate = {}, nextTemplate = {}) => {
  const { componentMap: prevComponentMap = {} } = prevTemplate;
  const { componentMap: nextComponentMap = {} } = nextTemplate;

  const nextComponents = Object.values(nextComponentMap);

  return nextComponents.find((component = {}) => {
    const { id: componentId } = component;

    return prevComponentMap[componentId] === undefined;
  });
};

const findContainer = (dom = {}) => {
  const { parentElement, ownerDocument } = dom;

  if (!parentElement) {
    return;
  }

  if (!ownerDocument) {
    return;
  }

  const { body } = ownerDocument;

  if (parentElement === body) {
    return dom;
  }

  return findContainer(parentElement);
};

const withContainer = memoize((ComponentClass) => forwardRef((props = {}, ref) => {
  const { __component: data = {}, ...others } = props;

  useContainer(ref, data);

  return (
    <ComponentClass ref={ref} {...others} />
  );
}));

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

const useMergedOptions = (props = {}) => {
  const { options = {} } = props;

  const denpendencies = Object.values(options);

  return useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    denpendencies,
  );
};

const useGetComponentChildrenKeys = (props = {}) => {
  const options = useMergedOptions(props) || {};

  const {
    getComponentPropsSchema,
    getComponentChildrenKeys,
  } = options;

  return useEventCallback((component = {}) => {
    const childrenKeys = getComponentChildrenKeys(component);

    if (childrenKeys !== undefined) {
      return childrenKeys;
    }

    const propsSchema = getComponentPropsSchema(component) || {};
    const { properties = {} } = propsSchema;
    const { children: { type } = {} } = properties;

    return type === 'node' ? ['children'] : [];
  });
};

export const useCore = (props = {}) => {
  const { core: propsCore } = props;

  const options = useMergedOptions(props) || {};
  const getComponentChildrenKeys = useGetComponentChildrenKeys(props);

  return useMemo(() => {
    const core = propsCore || new Core();

    core.reset({
      ...options,
      getComponentChildrenKeys,
    });

    return core;
  }, [options, propsCore, getComponentChildrenKeys]);
};

const useGetComponentClass = (props = {}) => {
  const { value = {} } = props;

  const core = useCore(props);
  const options = useMergedOptions(props) || {};
  const getComponentChildrenKeys = useGetComponentChildrenKeys(props);

  const { getComponentClass } = options;

  return useEventCallback((component = {}) => {
    const ComponentClass = getComponentClass(component) || 'div';

    let HOC;
    const relatedParentIds = core.findRelatedParentIds(value)(component) || [];
    const childrenKeys = getComponentChildrenKeys(component) || [];

    if (relatedParentIds.length) {
      HOC = withContainer;
    } else {
      HOC = childrenKeys.length ? withDragAndDrop : withDragAndHover;
    }

    return HOC(ComponentClass);
  });
};

const useGetComponentRenderDependencies = (props = {}) => {
  const { value = {}, selectedComponent = {} } = props;
  const { relationMap = {} } = value;

  const core = useCore(props);
  const options = useMergedOptions(props) || {};
  const getComponentChildrenKeys = useGetComponentChildrenKeys(props);

  const { getComponentRenderDependencies } = options;

  return useEventCallback((component = {}) => {
    const { id: selectedComponentId } = selectedComponent;
    const { id: componentId } = component;

    const childrenKeys = getComponentChildrenKeys(component) || [];
    const key = childrenKeys.join('/');

    const selected = selectedComponentId === componentId;
    const rest = getComponentRenderDependencies(component) || [];

    let contained;
    const relation = relationMap[componentId] || {};
    const keysGroup = findRelationKeysGroup(relation) || [];

    if (keysGroup.length <= 1) {
      contained = false;
    } else {
      const relatedParentIds = core.findRelatedParentIds(value)(selectedComponent) || [];
      const [firstRelatedParentId] = relatedParentIds;

      contained = firstRelatedParentId === componentId;
    }

    return [key, selected, contained, ...rest];
  });
};

const useRender = (props = {}) => {
  const options = useMergedOptions(props) || {};
  const getComponentChildrenKeys = useGetComponentChildrenKeys(props);

  const { render } = options;

  return useEventCallback((ComponentClass, component) => (renderProps = {}, ref) => {
    let { key } = renderProps;
    const childrenKeys = getComponentChildrenKeys(component) || [];

    key = getKey(key, ...childrenKeys);
    renderProps = { ...renderProps, key, __component: component };

    return render(ComponentClass, component)(renderProps, ref);
  });
};

export const useOptions = (props = {}) => {
  const options = useMergedOptions(props);

  const getComponentClass = useGetComponentClass(props);
  const getComponentRenderDependencies = useGetComponentRenderDependencies(props);
  const render = useRender(props);

  return useMemo(
    () => ({
      ...options,
      getComponentClass,
      getComponentRenderDependencies,
      render,
    }),
    [options, getComponentClass, getComponentRenderDependencies, render],
  );
};

export const useDndValue = (props = {}, ref) => {
  const {
    value: propsValue = {},
    selectedComponent: propsSelectedComponent = {},
    highlight: propsHighlight,
    document: propsDocument = document,
    onChange = () => {},
    onSelectComponent = () => {},
  } = props;

  const core = useCore(props);
  const config = useContext(ConfigContext);
  const denpencies = Object.values(config);

  const highlight = useMemo(() => {
    return propsHighlight === undefined
      ? new Highlight(propsDocument.documentElement)
      : propsHighlight;
  }, [propsDocument, propsHighlight]);

  const isInChildren = useEventCallback(
    core.isInChildren(propsValue),
  );

  const onDragHover = useThrottleCallback((targetInfo = {}, component = {}) => {
    let value = core.cutComponent(propsValue)(component);
    value = core.appendComponent(value)(targetInfo, component);

    const similar = isSimilar(propsValue, value);

    if (similar) {
      return;
    }

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

  const onRender = useEventCallback((dom = {}, component = {}) => {
    const { id: selectedComponentId } = propsSelectedComponent;
    const { id: componentId } = component;

    if (!dom) {
      return;
    }

    dom[KEY] = ref;

    const { ownerDocument } = dom;
    const relatedParentIds = core.findRelatedParentIds(propsValue)(propsSelectedComponent) || [];
    const contained = relatedParentIds[0] === componentId;
    const selected = selectedComponentId === componentId;

    if (ownerDocument && ownerDocument !== propsDocument) {
      const container = findContainer(dom);

      propsDocument.body.appendChild(container);
    }

    if (!highlight) {
      return;
    }

    const { render } = highlight;

    if (!selected && !contained) {
      return;
    }

    const style = {
      'border-style': contained ? 'dashed' : 'solid',
    };

    render && render(dom, style);
  });

  useEffect(() => {
    if (!highlight) {
      return;
    }

    const { clear } = highlight;

    return () => clear && clear();
  }, [highlight]);

  return useMemo(() => {
    const { dummy = true, ...others } = config;

    return {
      ...others,
      dummy,
      isInChildren,
      onDragEnd,
      onDragHover,
      onRender,
      onClick,
    };
  }, [isInChildren, onDragEnd, onDragHover, onClick, onRender, ...denpencies]);
};

export const useTriggers = (props = {}, ref) => {
  const {
    document: propsDocument = document,
    value: propsValue = {},
    selectedComponent: propsSelectedComponent = {},
    onChange = () => {},
    onSelectComponent = () => {},
    onKeyDownCapture: propsOnKeyDownCapture = () => {},
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

  const onKeyDownCapture = useEventCallback((e) => {
    const { current } = ref;

    if (!current) {
      return;
    }

    const node = findDOMNode(current);
    const hoveredElements = Array.from(propsDocument.querySelectorAll('*:hover'));
    const hovered = hoveredElements.some((element = {}) => {
      return element === node || element[KEY] === ref;
    });

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

    propsOnKeyDownCapture(e);
  });

  useEffect(() => {
    propsDocument.addEventListener('keydown', onKeyDownCapture, true);
    return () => propsDocument.removeEventListener('keydown', onKeyDownCapture, true);
  }, [propsDocument, onKeyDownCapture, ref]);

  useEffect(() => {
    if (document !== propsDocument) {
      document.addEventListener('keydown', onKeyDownCapture, true);
      return () => document.removeEventListener('keydown', onKeyDownCapture, true);
    }
  }, [propsDocument, onKeyDownCapture, ref]);
};
