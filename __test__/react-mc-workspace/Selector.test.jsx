import React, {
  useRef,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Workspace, {
  Selector,
  Collection,
  Decoration,
  Definition,
  ArgumentSelect,
} from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('Selector filter by analysing Decoration title', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = '装饰标题';

    const target = {
      type: 'decoration_prop_title',
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter by analysing Decoration content', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = '装饰内容';

    const target = {
      type: 'decoration_prop_content',
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter by analysing Decoration children', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = '装饰子级标题';

    const target = {
      type: 'decoration_prop_children',
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter by Definition type', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = 'decoration_prop_content';

    const target = {
      type: 'decoration_prop_content',
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter by analysing ArgumentSelect options label', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = '二二二';

    const options = [
      { value: 111, label: '一一一' },
      { value: 222, label: '二二二' },
    ];

    const target = {
      type: 'argument_select_options',
      value: [222],
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const ArgumentSelectOptions = () => {
      const ref = useClickRef();

      return (
        <span ref={ref}>
          <ArgumentSelect options={options} />
        </span>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
          <Definition type="argument_select_options" ComponentClass={ArgumentSelectOptions} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter by analysing ArgumentSelect options value', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = '222';

    const options = [
      { value: 111, label: '一一一' },
      { value: 222, label: '二二二' },
    ];

    const target = {
      type: 'argument_select_options',
      value: [222],
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const ArgumentSelectOptions = () => {
      const ref = useClickRef();

      return (
        <span ref={ref}>
          <ArgumentSelect options={options} />
        </span>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
          <Definition type="argument_select_options" ComponentClass={ArgumentSelectOptions} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter by analysing multiple ArgumentSelect options value', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const keyword = '333';

    const options1 = [
      { value: 111, label: '一一一' },
      { value: 222, label: '二二二' },
    ];

    const options2 = [
      { value: 333, label: '三三三' },
      { value: 444, label: '四四四' },
    ];

    const target = {
      type: 'argument_select_options',
      value: ['', 333],
    };

    const useClickRef = () => {
      const ref = useRef();

      useEffect(() => {
        const { current } = ref;

        current && current.click();
      }, []);

      return ref;
    };

    const DecorationPropTitle = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref} title="装饰标题" />
      );
    };

    const DecorationPropContent = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          装饰内容
        </Decoration>
      );
    };

    const DecorationPropChildren = () => {
      const ref = useClickRef();

      return (
        <Decoration ref={ref}>
          <span title="装饰子级标题" />
        </Decoration>
      );
    };

    const ArgumentSelectOptions = () => {
      const ref = useClickRef();

      return (
        <span ref={ref}>
          <ArgumentSelect options={options1} />
          <ArgumentSelect options={options2} />
        </span>
      );
    };

    const onChange = (source = {}) => {
      expect(source).to.deep.include(target);
      done();
    };

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={DecorationPropTitle} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass={DecorationPropContent} />
          <Definition type="decoration_prop_children" ComponentClass={DecorationPropChildren} />
          <Definition type="argument_select_options" ComponentClass={ArgumentSelectOptions} />
        </Collection>
        <Selector keyword={keyword} onChange={onChange} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
