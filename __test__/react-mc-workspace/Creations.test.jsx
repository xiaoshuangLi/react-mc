import React, {
  useRef,
  useEffect,
  createRef,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { useEventCallback } from 'shared/hooks';

import Workspace, { Collection, Definition, Creations } from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('Creations render right type ComponentClass', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const value = [
      { type: 'test_1' },
      { type: 'test_2' },
    ];

    const target = 'test_1test_2';

    const ComponentClass = (props = {}) => {
      const { type } = props;

      return type;
    };

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      expect(current.innerHTML).to.equal(target);
      done();
    }, 1000);

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="test_1" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="test_2" ComponentClass={ComponentClass} />
        </Collection>
        <Creations ref={ref} value={value} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations trigger change value', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = [
      { type: 'test_1' },
      { type: 'test_2', value: [1] },
    ];

    const target = [
      { type: 'test_1', value: [1] },
      { type: 'test_2', value: [2] },
    ];

    const ComponentClass = (props = {}) => {
      const {
        type,
        value: propsValue = [],
        onChange: propsOnChange,
      } = props;

      const setValue = useEventCallback(() => {
        const [first = 0, ...rest] = propsValue;

        propsOnChange([first + 1, ...rest]);
      });

      useEffect(
        () => setValue(),
        [type, setValue],
      );

      return null;
    };

    const onChange = (source) => {
      expect(source.length).to.equal(target.length);
      expect(source[0]).to.deep.include(target[0]);
      expect(source[1]).to.deep.include(target[1]);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="test_1" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="test_2" ComponentClass={ComponentClass} />
        </Collection>
        <Creations value={value} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations trigger change value by create', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const value = [
      { type: 'test_1', value: [1] },
      { type: 'test_2', value: [2] },
    ];

    const target = [
      { type: 'test_1', value: [1] },
      { type: 'test_2', value: [2] },
      { type: 'test_1' },
    ];

    let test;

    const ComponentClass = (props = {}) => {
      const { type, onChange: propsOnChange } = props;

      const trigger = useRef();

      useEffect(() => {
        const { current } = trigger;

        if (!current) {
          return;
        }

        current.click();
      }, []);

      if (propsOnChange) {
        return null;
      }

      if (type !== 'test_1') {
        return null;
      }

      return (
        <span ref={trigger} />
      );
    };

    const onChange = (source) => {
      expect(source.length).to.equal(target.length);
      expect(source[0]).to.deep.include(target[0]);
      expect(source[1]).to.deep.include(target[1]);
      expect(source[2]).to.deep.include(target[2]);
      done();
    };

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const elements = [...current.children];

      elements.forEach((element) => element.click());
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="test_1" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="test_2" ComponentClass={ComponentClass} />
        </Collection>
        <Creations ref={ref} value={value} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
