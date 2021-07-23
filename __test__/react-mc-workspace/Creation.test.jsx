import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Workspace, { Collection, Definition, Creation } from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('Creation render right type ComponentClass', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'test_1';

    const ComponentClass = (props = {}) => {
      const { type } = props;

      useEffect(() => {
        source += type;
      }, [type]);

      return null;
    };

    setTimeout(() => {
      expect(source).to.equal(target);
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
        <Creation type="test_1" />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creation trigger change value', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = [];
    const target = [1];

    const ComponentClass = (props = {}) => {
      const {
        value: propsValue,
        onChange: propsOnChange,
      } = props;

      useEffect(() => {
        expect(propsValue).to.equal(value);
        propsOnChange(target);
      }, [propsValue, propsOnChange]);

      return null;
    };

    const onChange = (nextValue) => {
      expect(nextValue).to.equal(target);
      done();
    };

    const element = (
      <Workspace>
        <Definition type="test_1" ComponentClass={ComponentClass} />
        <Creation value={value} type="test_1" onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
