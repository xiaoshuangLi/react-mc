import React, { useState } from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ReactMCTemplate from 'react-mc-template';
import { withDrag } from 'react-mc-dnd';

const list = [
  {
    data: {
      name: 'div',
      props: {
        children: 'test',
        style: {
          margin: 5,
          padding: 10,
          background: 'rgba(255, 0, 0, .2)',
          borderRadius: 5,
        },
      },
    },
  },
];

const App = React.forwardRef((props = {}, ref) => {
  const { className, ...others } = props;

  const [value = {}, setValue] = useState({});
  const [component = {}, setComponent] = useState({});

  const cls = classnames({
    'components-app-render': true,
    [className]: !!className,
  });

  const renderTemplate = () => {
    return (
      <ReactMCTemplate
        className="app-template"
        ref={ref}
        value={value}
        selectedComponent={component}
        onChange={setValue}
        onSelectComponent={setComponent}
        {...others}
      />
    );
  };

  const renderComponents = () => {
    const items = list.map((item, index) => {
      const { data = {} } = item;
      const { name } = data;

      const Comp = withDrag('div', {
        id: uuidv4(),
        ...data,
      });

      return (
        <Comp className="components-item" key={index}>
          { name }
        </Comp>
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
        { renderTemplate() }
        { renderComponents() }
      </div>
    </DndProvider>
  );
});

export default App;
