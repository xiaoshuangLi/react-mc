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

const children = (
  <div id="target" />
);

const initialValue = [
  { source: '1', target: '2' },
  { source: '1', target: '2', children },
];

const activeValue = [
  { source: '1', target: '2' },
  { active: true, source: '1', target: '2', children },
];

const deletedValue = [
  { source: '1', target: '2' },
];

describe('react-mc-diagrams: ', () => {
  it('click active work', (done) => {
    const root = document.createElement('div');

    const onChange = (nextValue) => {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(activeValue);

      expect(a).to.equal(b);
    };

    const Container = () => {
      useEffect(() => {
        setTimeout(() => {
          const target = root.querySelector('#target');

          target.click();
          done();
        });
      }, []);

      return (
        <DndProvider backend={HTML5Backend} context={window}>
          <Diagrams value={initialValue} onChange={onChange}>
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

  it('click unactive work', (done) => {
    const root = document.createElement('div');

    const onChange = (nextValue) => {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(initialValue);

      expect(a).to.equal(b);
    };

    const Container = () => {
      useEffect(() => {
        setTimeout(() => {
          const target = root.querySelector('#target');

          target.click();
          done();
        });
      }, []);

      return (
        <DndProvider backend={HTML5Backend} context={window}>
          <Diagrams value={activeValue} onChange={onChange}>
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

  it('double-click delete work', (done) => {
    const root = document.createElement('div');

    const onChange = (nextValue) => {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(deletedValue);

      expect(a).to.equal(b);
    };

    const Container = () => {
      useEffect(() => {
        setTimeout(() => {
          const target = root.querySelector('#target');
          const event = new MouseEvent('dblclick', {
            view: window,
            bubbles: true,
            cancelable: true
          });

          target.dispatchEvent(event);
          done();
        });
      }, []);

      return (
        <DndProvider backend={HTML5Backend} context={window}>
          <Diagrams value={initialValue} onChange={onChange}>
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
