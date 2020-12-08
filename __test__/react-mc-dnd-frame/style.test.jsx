import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Frame from 'react-mc-dnd-frame';

const COUNT = 3;
const ATTRIBUTE = 'style-element';
const IGNORE_ATTRIBUTE = 'data-frame-ignore';
const TAGS = ['svg', 'style', 'link'];

TAGS.forEach((tag) => {
  for (let v = 0; v < COUNT; v += 1) {
    const element = document.createElement(tag);

    element.id = `${tag}${v}`;
    element.setAttribute(ATTRIBUTE, '');
    document.body.appendChild(element);
  }
});

TAGS.forEach((tag) => {
  for (let v = 0; v < COUNT; v += 1) {
    const element = document.createElement(tag);

    element.id = `${tag}${v}`;
    element.setAttribute(IGNORE_ATTRIBUTE, '');
    document.body.appendChild(element);
  }
});

describe('react-mc-dnd-frame:', () => {
  it('should copy style element from parent when did mount', () => {
    const ref = createRef();
    const div = document.createElement('div');

    document.body.appendChild(div);
    ReactDOM.render(
      <Frame ref={ref} />,
      div,
    );

    const iframe = ReactDOM.findDOMNode(ref.current);

    TAGS.forEach((tag) => {
      const elements = iframe.contentDocument.querySelectorAll(`${tag}[${ATTRIBUTE}]`);

      expect(elements).to.have.lengthOf(COUNT);
    });
  });

  it('should copy style element from parent when update', (done) => {
    const ref = createRef();
    const div = document.createElement('div');

    document.body.appendChild(div);
    ReactDOM.render(
      <Frame ref={ref} />,
      div,
    );

    const iframe = ReactDOM.findDOMNode(ref.current);

    setTimeout(() => {
      TAGS.forEach((tag) => {
        const element = document.createElement(tag);

        element.setAttribute(ATTRIBUTE, '');
        document.body.appendChild(element);
      });

      setTimeout(() => {
        TAGS.forEach((tag) => {
          const elements = iframe.contentDocument.querySelectorAll(`${tag}[${ATTRIBUTE}]`);

          expect(elements).to.have.lengthOf(COUNT + 1);
        });
        done();
      }, 500);
    }, 100);
  });

  it('should get right style when did mount', () => {
    const ref = createRef();
    const div = document.createElement('div');
    const style = document.createElement('style');

    document.body.appendChild(div);
    document.body.appendChild(style);
    style.innerHTML = `
      .did-mount-red {
        color: red;
      }
    `;
    ReactDOM.render(
      (
        <Frame>
          <div className="did-mount-red" ref={ref} />
        </Frame>
      ),
      div,
    );

    const dom = ReactDOM.findDOMNode(ref.current);
    const styleMap = dom.computedStyleMap();
    const color = styleMap.get('color').toString();

    expect(color).to.equal('rgb(255, 0, 0)');
  });

  it('should get right style when did update', (done) => {
    const ref = createRef();
    const div = document.createElement('div');

    document.body.appendChild(div);

    ReactDOM.render(
      (
        <Frame>
          <div className="did-update-red" ref={ref} />
        </Frame>
      ),
      div,
    );

    setTimeout(() => {
      const style = document.createElement('style');

      document.body.appendChild(style);
      style.innerHTML = `
        .did-update-red {
          color: red;
        }
      `;

      setTimeout(() => {
        const dom = ReactDOM.findDOMNode(ref.current);
        const styleMap = dom.computedStyleMap();
        const color = styleMap.get('color').toString();

        expect(color).to.equal('rgb(255, 0, 0)');
        done();
      }, 500);
    }, 100);
  });
});
