import {
  useState,
  useEffect,
  useContext,
  useMemo,
  createContext,
} from 'react';
import { findDOMNode } from 'react-dom';
import {
  useDrag as useOriginDrag,
  useDrop as useOriginDrop,
} from 'react-dnd';

import { isSame } from 'shared/array';
import { useEventCallback } from 'shared/hooks';

import {
  isBetween,
  isUsefulEntry,
  getPathFromEvent,
} from './utils';

const defaultContext = {
  dummy: false,
  onDrop: () => {},
  onDragEnd: () => {},
  onDragHover: () => {},
  onRender: () => {},
  isInChildren: () => false,
};

const ITEM = 'item';
const CONTAINER = 'container';
const KEY = Symbol('listener');

const accept = [ITEM, CONTAINER];

const useDOM = (ref = {}) => {
  const [, setDom] = useState(null);
  const { current } = ref;

  const dom = useMemo(() => {
    return findDOMNode(ref.current);
  }, [ref, current]);

  useEffect(() => {
    setDom(dom);
  }, [dom]);

  return dom;
};

const usePollingUpdate = (runEffect, getDependencies, time = 0) => {
  const [denpencies, setDenpencies] = useState([]);

  runEffect = useEventCallback(runEffect);
  getDependencies = useEventCallback(getDependencies);

  useEffect(
    () => runEffect(...denpencies),
    [runEffect, denpencies],
  );

  useEffect(() => {
    let timer;
    let prevDenpendices = [];

    const loop = () => {
      const nextDenpencies = getDependencies();
      const same = isSame(prevDenpendices, nextDenpencies);

      !same && setDenpencies(nextDenpencies);

      prevDenpendices = nextDenpencies;
      timer = setTimeout(loop, time);
    };

    loop();

    return () => timer && clearTimeout(timer);
  }, [getDependencies, setDenpencies, time]);
};

export const ConfigContext = createContext({});

const useConfig = () => {
  const context = useContext(ConfigContext);

  return useMemo(() => {
    return context
      ? { ...defaultContext, ...context }
      : context;
  }, [context]);
};

const useListener = () => {
  const config = useConfig();
  const { dummy } = config;

  return useEventCallback((dom, ...rest) => {
    if (!dom) {
      return;
    }

    dom[KEY] = true;

    const entries = Object.entries(config);
    const isUseful = isUsefulEntry(defaultContext);

    const list = entries
      .filter(isUseful)
      .map((entry = []) => {
        const [key, value] = entry;

        const trigger = key
          .replace('on', '')
          .toLowerCase();

        const listener = (e) => {
          const path = getPathFromEvent(e) || [];
          const triggerTarget = path.find(
            (element) => element && element[KEY],
          );

          dummy && e.preventDefault();
          dummy && e.stopPropagation();
          triggerTarget === dom && value(dom, ...rest);
        };

        return [trigger, listener];
      });

    list.forEach((item = []) => {
      const [trigger, listener] = item;

      dom.addEventListener(trigger, listener);
    });

    return () => list.forEach((item = []) => {
      const [trigger, listener] = item;

      dom.removeEventListener(trigger, listener);
    });
  });
};

export const useContainer = (ref, data) => {
  const dom = useDOM(ref);
  const addListener = useListener();

  useEffect(
    () => addListener(dom, data),
    [dom, data, addListener],
  );

  usePollingUpdate(
    () => {},
    () => [findDOMNode(ref.current), data],
    100,
  );
};

export const useDrag = (ref, data) => {
  const dom = useDOM(ref);
  const config = useConfig();
  const { onDragEnd } = config;

  const [, drag] = useOriginDrag({
    item: useMemo(
      () => ({ data, type: ITEM }),
      [data],
    ),
    end: useEventCallback((dragInfo = {}, monitor = {}) => {
      onDragEnd(dom, data, monitor);
    }),
  });

  drag(ref);
};

export const useDrop = (ref, targetInfo) => {
  const dom = useDOM(ref);
  const config = useConfig();

  const { isInChildren, onDrop, onDragHover } = config;
  const { parentData = {} } = targetInfo;

  const [, drop] = useOriginDrop({
    accept,
    drop: useEventCallback((dropInfo = {}, monitor = {}) => {
      onDrop(dom, parentData, monitor);
    }),
    hover: useEventCallback((dragInfo = {}, monitor = {}) => {
      const { data: dragData = {} } = dragInfo;

      if (!dom) {
        return;
      }

      if (isInChildren(parentData, dragData)) {
        return;
      }

      if (parentData === dragData) {
        return;
      }

      onDragHover(targetInfo, dragData);
    }),
  });

  drop(ref);
};

const createDndHooks = (type = ITEM) => {
  const useHooks = (ref, data) => {
    const isContainer = type === CONTAINER;

    const dom = useDOM(ref);
    const config = useConfig();
    const addListener = useListener();

    const {
      dummy,
      onDrop,
      onDragEnd,
      onDragHover,
      onRender,
      isInChildren,
    } = config;

    const { id = data } = data;

    const [info = {}, drag] = useOriginDrag({
      item: useMemo(
        () => ({ data, type }),
        [data],
      ),
      end: useEventCallback((dragInfo = {}, monitor = {}) => {
        onDragEnd(dom, data, monitor);
      }),
      collect: useEventCallback((monitor) => {
        const dragItem = monitor.getItem() || {};
        const { data: dragData = {} } = dragItem;
        const { id: dragId = dragData } = dragData;

        const same = id && dragId === id;
        const isDragging = same || monitor.isDragging();

        return {
          isDragging,
        };
      }),
    });

    const [, drop] = useOriginDrop({
      accept,
      drop: useEventCallback((dropInfo = {}, monitor = {}) => {
        onDrop(dom, data, monitor);
      }),
      hover: useEventCallback((dragInfo = {}, monitor = {}) => {
        const { data: dragData = {} } = dragInfo;
        const { id: dragId } = dragData;

        if (!dom) {
          return;
        }

        if (dragId === id) {
          return;
        }

        const rect = dom.getBoundingClientRect();
        const pointer = monitor.getClientOffset();

        const isBetweenX = isBetween(pointer.x);
        const isBetweenY = isBetween(pointer.y);

        const maxX = rect.x + rect.width;
        const maxY = rect.y + rect.height;

        let targetOffset = 0;
        let targetData = data;
        let targetParentData;

        if (isContainer) {
          const outsideRange = Math.min(3, rect.height * 0.3);

          if (isInChildren(dragData, data)) {
            return;
          }

          if (isBetweenX(rect.x, rect.x + outsideRange) || isBetweenY(rect.y, rect.y + outsideRange)) {
            // targetIndex -= 1;
          } else if (isBetweenX(maxX - outsideRange, maxX) || isBetweenY(maxY - outsideRange, maxY)) {
            targetOffset += 1;
          } else if (isInChildren(data, dragData)) {
            return;
          } else {
            targetData = undefined;
            targetParentData = data;
          }
        } else {
          const halfWidth = rect.width * 0.5;
          const halfHeight = rect.height * 0.5;

          if (isInChildren(data, dragData) || isInChildren(dragData, data)) {
            return;
          }

          if (isBetweenX(maxX - halfWidth, maxX) || isBetweenY(maxY - halfHeight, maxY)) {
            targetOffset += 1;
          }
        }

        onDragHover({
          data: targetData,
          offset: targetOffset,
          parentData: targetParentData,
        }, dragData);
      }),
    });

    const { isDragging } = info;

    usePollingUpdate(
      () => {
        dom && drag(drop(dom));
      },
      () => [findDOMNode(ref.current), data],
      100,
    );

    useEffect(
      () => addListener(dom, data),
      [dom, data, addListener],
    );

    useEffect(() => {
      if (!dom) {
        return;
      }

      if (dummy) {
        dom.setAttribute('data-dnd-dummy', 'true');
      } else {
        dom.removeAttribute('data-dnd-dummy');
      }
    }, [dom, dummy]);

    useEffect(() => {
      if (!dom) {
        return;
      }

      if (isDragging) {
        dom.setAttribute('data-dnd-dragging', 'true');
      } else {
        dom.removeAttribute('data-dnd-dragging');
      }
    }, [dom, isDragging]);

    useEffect(() => onRender(dom, data));
  };

  return useHooks;
};

export const useDragAndHover = createDndHooks(ITEM);
export const useDragAndDrop = createDndHooks(CONTAINER);
