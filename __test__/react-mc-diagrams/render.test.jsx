import React, {
  useState,
  useEffect,
  createRef,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Diagrams, { Dot } from 'react-mc-diagrams';

const initialValue = [
  { source: '1', target: '2' },
];

describe('react-mc-diagrams: ', () => {
  it('just render value when did mount', () => {
    const root = document.createElement('div');
    const element = (
      <DndProvider backend={HTML5Backend} context={window}>
        <Diagrams value={initialValue}>
          <Dot id="1" />
          <Dot id="2" />
        </Diagrams>
      </DndProvider>
    );

    document.body.appendChild(root);
    ReactDOM.render(element, root);

    const nodes = root.querySelectorAll('.line-render');
    expect(nodes.length).to.equal(1);
  });

  it('just render value when did update', (done) => {
    const root = document.createElement('div');

    const Container = () => {
      const [value, setValue] = useState([]);

      useEffect(() => {
        setValue(initialValue);

        setTimeout(() => {
          const nodes = root.querySelectorAll('.line-render');

          expect(nodes.length).to.equal(1);
        });

        done();
      }, []);

      return (
        <DndProvider backend={HTML5Backend} context={window}>
          <Diagrams value={value}>
            <Dot id="1" />
            <Dot id="2" />
          </Diagrams>
        </DndProvider>
      );
    };

    const element = (
      <Container />
    );

    document.body.appendChild(root);
    ReactDOM.render(element, root);
  });
});
