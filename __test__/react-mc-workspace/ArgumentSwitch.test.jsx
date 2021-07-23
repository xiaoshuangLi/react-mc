import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { ArgumentSwitch } from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('ArgumentSwitch trigger props onChange', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = true;

    const onChange = (source) => {
      expect(source).to.equal(target);
      done();
    };

    setTimeout(() => {
      const { current } = ref;

      current && current.click();
    });

    const element = (
      <ArgumentSwitch ref={ref} value={false} onChange={onChange} />
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentSwitch click stopPropagation', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const refWithoutOnChange = createRef();
    const refWithOnChange = createRef();

    const onChange = () => {};

    const onClickShouldBeFired = () => {
      setTimeout(() => done());
    };

    const onClickShouldNotBeFired = () => {
      throw new Error('should not be fired');
    };

    setTimeout(() => {
      const refs = [refWithoutOnChange, refWithOnChange];

      refs.forEach((ref = {}) => {
        const { current } = ref;

        current && current.click();
      });
    });

    const element = (
      <>
        <div onClick={onClickShouldBeFired}>
          <ArgumentSwitch ref={refWithoutOnChange} />
        </div>
        <div onClick={onClickShouldNotBeFired}>
          <ArgumentSwitch ref={refWithOnChange} onChange={onChange} />
        </div>
      </>
    );

    ReactDOM.render(element, div);
  });
});
