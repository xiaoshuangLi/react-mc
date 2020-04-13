import React, {
  memo,
  useRef,
  useState,
  useContext,
} from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { FrameContext } from 'react-frame-component';

import { useEventCallback } from 'shared/hooks';

import Frame from 'react-mc-dnd-frame';
import { useDrag } from 'react-mc-dnd';
import ReactMCRunner from 'react-mc-runner';
import ReactMCTemplate, { Core } from 'react-mc-template';

import * as buildInComponents from '../buildInComponents';

import options from './options';
import { getRandomItem, getImgProps } from './tools';

const core = new Core();

const entries = Object.entries(buildInComponents);

const FrameTemplate = React.forwardRef((props = {}, ref) => {
  const context = useContext(FrameContext);

  const {
    document: contextDocument = document,
    window: contextWindow = window,
  } = context;

  return (
    <ReactMCTemplate
      ref={ref}
      document={contextDocument}
      window={contextWindow}
      core={core}
      {...props}
    />
  );
});

// Just for get Random img, sooooo funny ...
const ComponentRender = memo((props = {}) => {
  const {
    entry = [],
    trigger,
    onSelect,
    onClick: propsOnClick,
    ...others
  } = props;
  const [name, ComponentClass] = entry;

  const ref = useRef(null);

  const dataProps = name === 'Img'
    ? getImgProps()
    : {};

  const data = {
    name,
    id: uuidv4(),
    props: dataProps,
  };

  const onClick = (...args) => {
    onSelect && onSelect(data);
    propsOnClick && propsOnClick(...args);
  };

  useDrag(ref, data);

  return (
    <div ref={ref} onClick={onClick} {...others}>
      <ComponentClass {...dataProps} />
    </div>
  );
});

const createData = (count = 10) => {
  const rootComponentIds = ['0'];
  const containerIds = rootComponentIds.slice();

  let relationMap = {};
  let componentMap = {
    0: { id: '0', name: 'Div' },
  };

  for (let v = 1; v < count; v += 1) {
    const parentId = getRandomItem(containerIds);
    const entry = getRandomItem(entries) || [];

    const [name] = entry;
    const id = `${v}`;
    const props = name === 'Img' ? getImgProps() : {};

    const moreComponentMap = {
      [v]: { id, name, props },
    };
    const baseParentRelation = relationMap[parentId] || {};
    const { children: baseChildren = [] } = baseParentRelation;

    const children = baseChildren.concat(`${v}`);
    const relation = { children };

    const moreRelationMap = {
      [parentId]: relation,
    };

    if (name === 'Div') {
      containerIds.push(id);
    }

    relationMap = { ...relationMap, ...moreRelationMap };
    componentMap = { ...componentMap, ...moreComponentMap };
  }

  return {
    rootComponentIds,
    relationMap,
    componentMap,
  };
};

const App = React.forwardRef((props = {}, ref) => {
  const { className } = props;

  // const [value = {}, setValue] = useState({});
  const [value = {}, setValue] = useState(() => createData(1000));
  const [selectedComponent = {}, setSelectedComponent] = useState({});

  const cls = classnames({
    'components-app-render': true,
    [className]: !!className,
  });

  const onSelect = useEventCallback((component = {}) => {
    const targetInfo = { data: selectedComponent, offset: 1 };
    const newValue = core.appendComponent(value)(targetInfo, component);

    setValue(newValue);
    setSelectedComponent(component);
  });

  const renderFrame = () => {
    return (
      <Frame className="app-frame">
        <FrameTemplate
          className="app-template-content"
          ref={ref}
          value={value}
          selectedComponent={selectedComponent}
          options={options}
          onChange={setValue}
          onSelectComponent={setSelectedComponent}
        />
      </Frame>
    );
  };

  const renderComponents = () => {
    const { componentMap = {} } = value;
    const trigger = Object.values(componentMap).length;

    const items = entries.map((entry = [], index) => {
      return (
        <ComponentRender
          className="components-item"
          key={index}
          entry={entry}
          trigger={trigger}
          onSelect={onSelect}
        />
      );
    });

    return (
      <div className="app-components">
        { items }
      </div>
    );
  };

  const renderRunner = () => {
    return (
      <div className="app-runner">
        <ReactMCRunner
          value={value}
          options={options}
          onChange={setValue}
        />
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <div className={cls}>
        { renderFrame() }
        { renderComponents() }
        { renderRunner() }
      </div>
    </DndProvider>
  );
});

export default App;
