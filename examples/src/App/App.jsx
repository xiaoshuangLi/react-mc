import React, {
  useState,
  useContext,
} from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { FrameContext } from 'react-frame-component';

import ReactMCTemplate from 'react-mc-template';
import Frame from 'react-mc-dnd-frame';
import { withDrag } from 'react-mc-dnd';

const list = [
  {
    data: {
      name: 'div',
      props: {
        children: 'container',
        style: {
          margin: 5,
          padding: 10,
          background: 'rgba(255, 0, 0, .2)',
          borderRadius: 5,
        },
      },
    },
  },
  {
    data: {
      name: 'button',
      props: {
        children: 'button',
        style: {
          padding: 5,
          margin: 5,
          border: 'none',
          background: 'rgba(0, 255, 0, .2)',
          borderRadius: 5,
        },
      },
    },
  },
];

const renderComponent = (curr = {}) => {
  const { name: ComponentClass, props = {} } = curr;

  return (
    <ComponentClass {...props} />
  );
};

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
      {...props}
    />
  );
});

const App = React.forwardRef((props = {}, ref) => {
  const { className } = props;

  const [value = {}, setValue] = useState({});
  const [component = {}, setComponent] = useState({});

  const cls = classnames({
    'components-app-render': true,
    [className]: !!className,
  });

  const renderFrame = () => {
    return (
      <Frame className="app-frame">
        <FrameTemplate
          className="app-template-content"
          ref={ref}
          value={value}
          selectedComponent={component}
          onChange={setValue}
          onSelectComponent={setComponent}
        />
      </Frame>
    );
  };

  const renderComponents = () => {
    const items = list.map((item, index) => {
      const { data = {} } = item;

      const ComponentClass = withDrag('div', {
        id: uuidv4(),
        ...data,
      });

      return (
        <ComponentClass className="components-item" key={index}>
          { renderComponent(data) }
        </ComponentClass>
      );
    });

    return (
      <div className="app-components">
        { items }
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <div className={cls}>
        { renderFrame() }
        { renderComponents() }
      </div>
    </DndProvider>
  );
});

export default App;
