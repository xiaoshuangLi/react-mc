import React, {
  useRef,
  useEffect,
  createRef,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Workspace, {
  Selector,
  Creations,
  Collection,
  Definition,
  ArgumentInput,
  ArgumentCreations,
} from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('Selector filter definitions by output', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = [
      {
        type: 'test',
        definitions: [
          {
            output: true,
            ComponentClass: 'div',
            type: 'decoration_prop_title',
          },
        ],
      },
    ];

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const { getCollections } = current;

      if (!getCollections) {
        return;
      }

      const source = getCollections() || [];

      expect(source.length).to.equal(target.length);
      expect(source[0]).to.deep.include(target[0]);
      done();
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition output type="decoration_prop_title" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass="div" />
          <Definition type="decoration_prop_children" ComponentClass="div" />
        </Collection>
        <Selector output ref={ref} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter definitions by conditions key/value', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const conditions = [
      { type: 'decoration_prop_content' },
    ];

    const target = [
      {
        type: 'test_1',
        definitions: [
          {
            output: false,
            ComponentClass: 'div',
            type: 'decoration_prop_content',
          },
        ],
      },
    ];

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const { getCollections } = current;

      if (!getCollections) {
        return;
      }

      const source = getCollections() || [];

      expect(source.length).to.equal(target.length);
      expect(source[0]).to.deep.include(target[0]);
      done();
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition output type="decoration_prop_title" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass="div" />
          <Definition type="decoration_prop_children" ComponentClass="div" />
        </Collection>
        <Selector ref={ref} conditions={conditions} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter definitions by conditions key/values', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const conditions = [
      {
        attribute: ['1', '2'],
      },
    ];

    const target = [
      {
        type: 'test_1',
        definitions: [
          {
            output: false,
            attribute: '1',
            ComponentClass: 'div',
            type: 'decoration_prop_content',
          },
          {
            output: false,
            attribute: '2',
            ComponentClass: 'div',
            type: 'decoration_prop_children',
          },
        ],
      },
    ];

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const { getCollections } = current;

      if (!getCollections) {
        return;
      }

      const source = getCollections() || [];

      expect(source.length).to.equal(target.length);
      expect(source[0]).to.deep.include(target[0]);
      done();
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition output type="decoration_prop_title" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition attribute="1" type="decoration_prop_content" ComponentClass="div" />
          <Definition attribute="2" type="decoration_prop_children" ComponentClass="div" />
        </Collection>
        <Selector ref={ref} conditions={conditions} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Selector filter definitions by conditions function', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const conditions = [
      (definition = {}) => {
        return definition.type === 'decoration_prop_content';
      },
    ];

    const target = [
      {
        type: 'test_1',
        definitions: [
          {
            output: false,
            attribute: '1',
            ComponentClass: 'div',
            type: 'decoration_prop_content',
          },
        ],
      },
    ];

    setTimeout(() => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const { getCollections } = current;

      if (!getCollections) {
        return;
      }

      const source = getCollections() || [];

      expect(source.length).to.equal(target.length);
      expect(source[0]).to.deep.include(target[0]);
      done();
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition output type="decoration_prop_title" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition attribute="1" type="decoration_prop_content" ComponentClass="div" />
          <Definition attribute="2" type="decoration_prop_children" ComponentClass="div" />
        </Collection>
        <Selector ref={ref} conditions={conditions} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations filter by children Selector', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = {
      type: 'decoration_prop_content',
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

      if (!current) {
        return;
      }

      const elements = [...current.children];

      elements.forEach((element) => element.click());
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition output type="decoration_prop_content" ComponentClass={ComponentClass} />
          <Definition output type="decoration_prop_children" ComponentClass={ComponentClass} />
        </Collection>
        <Creations ref={ref} onChange={onChange}>
          <Selector output />
        </Creations>
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations click creator trigger onChange when Selector returns only one Definition', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = {
      type: 'decoration_prop_children',
    };

    const onChange = (source) => {
      expect(source).to.deep.include(target);
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
          <Definition type="decoration_prop_title" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass="div" />
          <Definition output type="decoration_prop_children" ComponentClass="div" />
        </Collection>
        <Creations ref={ref} onChange={onChange}>
          <Selector output />
        </Creations>
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentCreations filter by children Selector', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = {
      type: 'decoration_prop_content',
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

      if (!current) {
        return;
      }

      const elements = [...current.children];

      elements.forEach((element) => element.click());
    });

    const element = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition output type="decoration_prop_content" ComponentClass={ComponentClass} />
          <Definition output type="decoration_prop_children" ComponentClass={ComponentClass} />
        </Collection>
        <ArgumentCreations ref={ref} onChange={onChange}>
          <Selector output />
        </ArgumentCreations>
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentCreations click creator trigger onChange when Selector returns only one Definition', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = {
      type: 'decoration_prop_children',
    };

    const onChange = (source) => {
      expect(source).to.deep.include(target);
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
          <Definition type="decoration_prop_title" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="decoration_prop_content" ComponentClass="div" />
          <Definition output type="decoration_prop_children" ComponentClass="div" />
        </Collection>
        <ArgumentCreations ref={ref} onChange={onChange}>
          <Selector output />
        </ArgumentCreations>
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('ArgumentInput filter by children Selector', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const ref = createRef();

    const target = {
      type: 'decoration_prop_children',
    };

    const conditions = [{
      type: 'decoration_prop_children',
    }];

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
        <Collection type="test" title="测试">
          <Definition type="decoration_prop_title" ComponentClass={ComponentClass} />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition output type="decoration_prop_content" ComponentClass={ComponentClass} />
          <Definition output type="decoration_prop_children" ComponentClass={ComponentClass} />
        </Collection>
        <ArgumentInput ref={ref} onChange={onChange}>
          <Selector conditions={conditions} />
        </ArgumentInput>
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
