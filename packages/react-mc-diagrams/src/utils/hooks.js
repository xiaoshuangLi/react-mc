import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  createRef,
  createContext,
} from 'react';

import { ConfigContext } from 'react-mc-dnd';

import {
  useEventCallback,
  useThrottleCallback,
} from 'shared/hooks';

import {
  EMPTY_ARRAY,
  PERFORMANCE_TIME,
  MOVABLE,
} from './constants';

export const LinesContext = createContext([]);
export const DotsContext = createContext([]);
export const CanvasContext = createContext([]);

export const useStableRef = (ref) => {
  return useMemo(
    () => ref || createRef(null),
    [ref],
  );
};

export const useLinesValue = (props) => {
  const { value = EMPTY_ARRAY, onChange } = props;

  const store = useRef(value);
  const using = useState(value);
  const [lines, setLines] = using;

  const onChangeLines = useEventCallback(() => {
    if (lines === value) {
      return;
    }

    if (lines === store.current) {
      return;
    }

    onChange && onChange(lines);
  });

  const onChangeValue = useEventCallback(() => {
    if (value === lines) {
      return;
    }

    store.current = value;
    setLines && setLines(value);
  });

  useEffect(onChangeLines, [lines]);
  useEffect(onChangeValue, [value]);

  return useMemo(() => using, using);
};

export const useDotsValue = (props) => {
  const ref = useRef([]);
  const using = useState([]);

  return useMemo(
    () => Object.assign(ref.current, using),
    using,
  );
};

export const useCanvasValue = (props) => {
  const using = useState(null);

  return useMemo(() => using, using);
};

export const useDrawed = (props = {}) => {
  const { value, onChange: propsOnChange } = props;

  const setValue = (...args) => {
    propsOnChange && propsOnChange(...args);
  };

  return [value, setValue];
};

let position = {
  top: undefined,
  left: undefined,
};

let positionOffset = {
  top: undefined,
  left: undefined,
};

export const useDragStart = (props = {}) => {
  const { onDragStart: propsOnDragStart } = props;

  return useEventCallback((...args) => {
    const [e = {}] = args;
    const { clientX, clientY, target } = e;

    const { top, left } = target.getBoundingClientRect();

    positionOffset = {
      top: clientY - top,
      left: clientX - left,
    };

    propsOnDragStart && propsOnDragStart(...args);
  });
};

export const useDragOver = (props = {}) => {
  const { onDragOver: propsOnDragOver } = props;

  return useEventCallback((...args) => {
    const [e = {}] = args;
    const { clientX, clientY, currentTarget } = e;
    const { top: offsetTop, left: offsetLeft } = positionOffset;

    const { top, left } = currentTarget.getBoundingClientRect();

    position = {
      top: clientY - top - offsetTop,
      left: clientX - left - offsetLeft,
    };

    propsOnDragOver && propsOnDragOver(...args);
  });
};

export const useDragEnd = (props = {}) => {
  const { onDragEnd: propsOnDragEnd } = props;

  return useEventCallback((...args) => {
    position = {};
    positionOffset = {};
    propsOnDragEnd && propsOnDragEnd(...args);
  });
};

export const useConfigValue = (props = {}, context = {}) => {
  const {
    onMove: propsOnMove,
    onDragHover: propsOnDragHover,
    onDrop: propsOnDrop,
  } = props;

  const {
    drawed = [],
    dirty = [],
    messy = [],
  } = context;

  const [lines, setLines] = drawed;

  const [dirtyDots, setDirtyDots] = dirty;
  const [messyLines, setMessyLines] = messy;

  const config = useContext(ConfigContext);
  const {
    onDrop: configOnDrop,
    onDragHover: configOnDragHover,
  } = config;

  const createLine = useEventCallback((line = {}) => {
    const { source, target } = line;

    const keys = [source, target];
    const matchLines = lines.filter((item = {}) => {
      const targetInclued = keys.includes(item.target);
      const sourceInclued = keys.includes(item.source);

      return targetInclued && sourceInclued;
    });

    const { length } = matchLines;

    const num = Math.ceil(length / 2);
    const found = matchLines.find(
      (item = {}) => item.offset === num,
    ) || {};

    const { source: foundSource } = found;
    const ratio = source === foundSource ? -1 : 1;
    const offset = num * ratio;

    return { ...line, offset };
  });

  const changeDirtyDotsWhenDragHover = useEventCallback((targetInfo, dragData = {}) => {
    const { dotId, ...restDragData } = dragData;
    const { id: dragDataId } = restDragData;

    const found = dirtyDots.find(
      (item = {}) => item.id === dragDataId,
    );

    const current = found
      ? { ...found, ...restDragData, style: position }
      : { ...restDragData, style: position };

    let nextDirtyDots;

    if (found) {
      nextDirtyDots = dirtyDots.map((item) => {
        return item === found ? current : item;
      });
    } else {
      nextDirtyDots = dirtyDots.concat(current);
    }

    setDirtyDots(nextDirtyDots);
  });

  const changeMessyLinesWhenDragHover = useEventCallback((targetInfo = {}, dragData = {}) => {
    const { parentData: { id: parentDataId } = {} } = targetInfo;
    const {
      id: dragDataId,
      type: dragDataType,
      dotId: dragDataDotId,
    } = dragData;

    if (!dragDataType) {
      return;
    }

    if (parentDataId === dragDataId) {
      return;
    }

    const found = messyLines.find(
      (item = {}) => item.source === dragDataDotId,
    );

    let current;

    if (parentDataId) {
      current = createLine({
        source: dragDataDotId,
        target: parentDataId,
      });
    } else {
      current = {
        source: dragDataDotId,
        target: dragDataId,
      };
    }

    let nextMessyLines;

    if (found) {
      nextMessyLines = messyLines.map((item) => {
        return item === found ? current : item;
      });
    } else {
      nextMessyLines = messyLines.concat(current);
    }

    setMessyLines(nextMessyLines);
  });

  const onDragHover = useThrottleCallback((...args) => {
    const [targetInfo, dragData = {}, monitor] = args;
    const {
      id: dragDataId,
      type: dragDataType,
      dotId: dragDataDotId,
    } = dragData;

    propsOnDragHover && propsOnDragHover(...args);
    configOnDragHover && configOnDragHover(...args);

    if (!dragDataId) {
      return;
    }

    if (dragDataType === MOVABLE) {
      const { top, left } = position;

      if (top === undefined || left === undefined) {
        return;
      }

      return propsOnMove && propsOnMove({
        id: dragDataId,
        position,
      });
    }

    if (!dragDataDotId) {
      return;
    }

    if (!monitor.isOver({ shallow: true })) {
      return;
    }

    changeDirtyDotsWhenDragHover(targetInfo, dragData);
    changeMessyLinesWhenDragHover(targetInfo, dragData);
  }, PERFORMANCE_TIME);

  const onDrop = useEventCallback((...args) => {
    const [, parentData = {}] = args;
    const { id: parentDataId } = parentData;

    propsOnDrop && propsOnDrop(...args);
    configOnDrop && configOnDrop(...args);

    if (parentDataId && messyLines.length) {
      setLines([...lines, ...messyLines]);
    }

    setDirtyDots([]);
    setMessyLines([]);
  });

  return useMemo(
    () => ({ ...config, onDragHover, onDrop }),
    [config, onDragHover, onDrop],
  );
};
