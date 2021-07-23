import React, {
  useRef,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { useEventCallback } from 'shared/hooks';

import Workspace, {
  Creation,
  Definition,
  Decoration,
  ArgumentInput,
} from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('Workspace change theme with r g b', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = [];

    const style = {
      '--workspace-theme-color-r': 255,
      '--workspace-theme-color-g': 0,
      '--workspace-theme-color-b': 0,
    };

    const targetColor = 'rgb(255, 0, 0)';
    const targetColorLight = 'rgba(255, 0, 0, 0.3)';
    const targetColorLighter = 'rgba(255, 0, 0, 0.1)';

    const Test = (props = {}) => {
      const { value: propsValue } = props;

      const valueRef = useRef(null);
      const placeholdeRef = useRef(null);

      const testValueColor = useEventCallback(() => {
        const { current } = valueRef;

        if (!current) {
          return;
        }

        if (propsValue === value) {
          return;
        }

        const computedStyle = window.getComputedStyle(current);

        const color = computedStyle.getPropertyValue('color');
        const backgroundColor = computedStyle.getPropertyValue('background-color');

        expect(color).to.equal(targetColor);
        expect(backgroundColor).to.equal(targetColorLighter);
      });

      const testPlaceholderColor = useEventCallback(() => {
        const { current } = placeholdeRef;

        if (!current) {
          return;
        }

        if (propsValue === value) {
          return;
        }

        const computedStyle = window.getComputedStyle(current);

        const color = computedStyle.getPropertyValue('color');

        expect(color).to.equal(targetColorLight);
      });

      useEffect(() => {
        if (!valueRef.current) {
          return;
        }

        if (!placeholdeRef.current) {
          return;
        }

        testValueColor();
        testPlaceholderColor();

        if (propsValue === value) {
          return;
        }

        done();
      }, [propsValue, testValueColor, testPlaceholderColor]);

      useEffect(() => {
        const { current } = valueRef;

        if (propsValue !== value) {
          return;
        }

        current && current.click();
      }, []);

      return (
        <Decoration>
          <ArgumentInput ref={valueRef} value="test" onChange={console.log} />
          <ArgumentInput ref={placeholdeRef} placeholder="test" onChange={console.log} />
        </Decoration>
      );
    };

    const element = (
      <Workspace style={style}>
        <Definition output type="test" ComponentClass={Test} />
        <Creation value={value} type="test" onChange={console.log} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Workspace change theme with theme color', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = [];

    const targetColor = 'rgb(255, 0, 0)';
    const targetColorLight = 'rgb(0, 255, 0)';
    const targetColorLighter = 'rgb(0, 0, 255)';

    const style = {
      '--workspace-theme-color': targetColor,
      '--workspace-theme-color-light': targetColorLight,
      '--workspace-theme-color-lighter': targetColorLighter,
    };

    const Test = (props = {}) => {
      const { value: propsValue } = props;

      const valueRef = useRef(null);
      const placeholdeRef = useRef(null);

      const testValueColor = useEventCallback(() => {
        const { current } = valueRef;

        if (!current) {
          return;
        }

        if (propsValue === value) {
          return;
        }

        const computedStyle = window.getComputedStyle(current);

        const color = computedStyle.getPropertyValue('color');
        const backgroundColor = computedStyle.getPropertyValue('background-color');

        expect(color).to.equal(targetColor);
        expect(backgroundColor).to.equal(targetColorLighter);
      });

      const testPlaceholderColor = useEventCallback(() => {
        const { current } = placeholdeRef;

        if (!current) {
          return;
        }

        if (propsValue === value) {
          return;
        }

        const computedStyle = window.getComputedStyle(current);

        const color = computedStyle.getPropertyValue('color');

        expect(color).to.equal(targetColorLight);
      });

      useEffect(() => {
        if (!valueRef.current) {
          return;
        }

        if (!placeholdeRef.current) {
          return;
        }

        testValueColor();
        testPlaceholderColor();

        if (propsValue === value) {
          return;
        }

        done();
      }, [propsValue, testValueColor, testPlaceholderColor]);

      useEffect(() => {
        const { current } = valueRef;

        if (propsValue !== value) {
          return;
        }

        current && current.click();
      }, []);

      return (
        <Decoration>
          <ArgumentInput ref={valueRef} value="test" onChange={console.log} />
          <ArgumentInput ref={placeholdeRef} placeholder="test" onChange={console.log} />
        </Decoration>
      );
    };

    const element = (
      <Workspace style={style}>
        <Definition output type="test" ComponentClass={Test} />
        <Creation value={value} type="test" onChange={console.log} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
