import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { expect } from 'chai';

import Template from 'react-mc-template';

describe('react-mc-template: ', () => {
  it('props.onSelectComponent work', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
      },
    };

    const Div = React.forwardRef((props = {}, ref) => {
      useEffect(() => {
        setTimeout(() => {
          const dom = ReactDOM.findDOMNode(ref.current);

          dom.click();
        });
      }, [ref]);

      return (
        <div ref={ref} {...props} />
      );
    });

    const options = {
      getComponentClass: (component) => {
        return Div;
      },
    };

    const onSelectComponent = (component) => {
      expect(component).to.equal(value.componentMap['root-1']);
      done();
    };

    const element = (
      <DndProvider backend={HTML5Backend} context={window}>
        <Template
          value={value}
          options={options}
          onSelectComponent={onSelectComponent}
        />
      </DndProvider>
    );

    ReactDOM.render(element, div);
  });
});
