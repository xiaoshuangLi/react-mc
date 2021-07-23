import React, {
  useRef,
  useEffect,
  createRef,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Workspace, {
  Collection,
  Definition,
  ArgumentInput,
} from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('ArgumentInput trigger props onChange', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = {
      type: 'output',
    };

    const useClickRef = () => {
      const clickRef = useRef();

      useEffect(() => {
        const { current } = clickRef;

        current && current.click();
      }, []);

      return clickRef;
    };

    const ComponentClass = () => {
      const clickRef = useClickRef();

      return (
        <span ref={clickRef} />
      );
    };

    const onChange = (source) => {
      expect(source).to.deep.include(target);
      done();
    };

    setTimeout(() => {
      const { current } = ref;

      current && current.click();
    });

    const element = (
      <Workspace>
        <Collection type="test_1">
          <Definition type="not_output" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_2">
          <Definition output type="output" ComponentClass={ComponentClass} />
        </Collection>
        <ArgumentInput ref={ref} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentInput click stopPropagation', (done) => {
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
          <ArgumentInput ref={refWithoutOnChange} />
        </div>
        <div onClick={onClickShouldNotBeFired}>
          <ArgumentInput ref={refWithOnChange} onChange={onChange} />
        </div>
      </>
    );

    ReactDOM.render(element, div);
  });
});
