import React, {
  useRef,
  useEffect,
  createRef,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { ArgumentSelect } from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('ArgumentSelect render label correct', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = '二';

    const options = [
      { label: '一', value: 1 },
      { label: '二', value: 2 },
      { label: '三', value: 3 },
    ];

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const { innerHTML = '' } = current;

      expect(innerHTML).to.include(target);
      done();
    });

    const element = (
      <ArgumentSelect value={2} ref={ref} options={options} />
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentSelect trigger props onChange', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = 2;

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

    const label = (<ComponentClass />);

    const options = [
      { label: '', value: 1 },
      { label, value: 2 },
      { label: '', value: 3 },
    ];

    const onChange = (source) => {
      expect(source).to.equal(target);
      done();
    };

    setTimeout(() => {
      const { current } = ref;

      current && current.click();
    });

    const element = (
      <ArgumentSelect value={3} ref={ref} onChange={onChange} options={options} />
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentSelect click stopPropagation', (done) => {
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
          <ArgumentSelect ref={refWithoutOnChange} />
        </div>
        <div onClick={onClickShouldNotBeFired}>
          <ArgumentSelect ref={refWithOnChange} onChange={onChange} />
        </div>
      </>
    );

    ReactDOM.render(element, div);
  });
});
