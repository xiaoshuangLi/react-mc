import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ConfigContext } from 'react-mc-dnd';

import Line from './Line';
import Dot from './Dot';
import Canvas from './Canvas';

import { MESSY, DIRTY } from './utils/constants';

import {
  LinesContext,
  DotsContext,
  CanvasContext,
  useDotsValue,
  useCanvasValue,
  useLinesValue,
  useDragStart,
  useDragOver,
  useDragEnd,
  useConfigValue,
} from './utils/hooks';

const { Provider: ConfigProvider } = ConfigContext;
const { Provider: LinesProvider } = LinesContext;
const { Provider: DotsProvider } = DotsContext;
const { Provider: CanvasProvider } = CanvasContext;

const Diagrams = React.forwardRef((props = {}, ref) => {
  const {
    className,
    value,
    onDrop,
    onMove,
    onChange,
    onDragStart: a,
    onDragOver: b,
    onDragEnd: c,
    children,
    ...others
  } = props;

  const cls = classnames({
    'components-diagrams-render': true,
    [className]: !!className,
  });

  const canvasValue = useCanvasValue(props);
  const dotsValue = useDotsValue(props);
  const linesValue = useLinesValue(props);
  const [lines = [], setLines] = linesValue;

  const messy = useState([]);
  const [messyLines = []] = messy;

  const dirty = useState([]);
  const [dirtyDots = []] = dirty;

  const onDragStart = useDragStart(props);
  const onDragOver = useDragOver(props);
  const onDragEnd = useDragEnd(props);

  const configValue = useConfigValue(props, {
    drawed: linesValue,
    dirty,
    messy,
  });

  const renderDirtyDots = () => {
    const items = dirtyDots.map((dirtyDot = {}, index) => {
      return (
        <Dot key={index} type={DIRTY} {...dirtyDot} />
      );
    });

    return (
      <div className="diagrams-dirty-dots">
        { items }
      </div>
    );
  };

  const renderMessyLines = () => {
    const items = messyLines.map((messyLine = {}, index) => {
      return (
        <Line key={index} type={MESSY} {...messyLine} />
      );
    });

    return (
      <div className="diagrams-messy-lines">
        { items }
      </div>
    );
  };

  const renderLines = () => {
    const items = lines.map((line = {}, i) => {
      const onClick = () => setLines((prevLines = []) => {
        return prevLines.map((prevLine = {}) => {
          const { active, ...rest } = prevLine;

          if (prevLine === line) {
            return active
              ? rest
              : { active: !active, ...rest };
          }

          return prevLine;
        });
      });

      const onDoubleClick = () => setLines((prevLines = []) => {
        return prevLines.filter(
          (prevLine) => prevLine !== line,
        );
      });

      return (
        <Line key={i} onClick={onClick} onDoubleClick={onDoubleClick} {...line} />
      );
    });

    return (
      <div className="diagrams-lines">
        { items }
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="diagrams-content">
        { children }
      </div>
    );
  };

  return (
    <ConfigProvider value={configValue}>
      <LinesProvider value={linesValue}>
        <DotsProvider value={dotsValue}>
          <CanvasProvider value={canvasValue}>
            <Canvas
              ref={ref}
              className={cls}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              {...others}
            >
              { renderDirtyDots() }
              { renderMessyLines() }
              { renderLines() }
              { renderContent() }
            </Canvas>
          </CanvasProvider>
        </DotsProvider>
      </LinesProvider>
    </ConfigProvider>
  );
});

Diagrams.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired,
      active: PropTypes.bool,
    }),
  ),
  onDrop: PropTypes.func,
  onMove: PropTypes.func,
  onChange: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnd: PropTypes.func,
};

Diagrams.defaultProps = {
  value: [],
  onDrop: undefined,
  onMove: undefined,
  onChange: undefined,
  onDragStart: undefined,
  onDragOver: undefined,
  onDragEnd: undefined,
};

export default Diagrams;
