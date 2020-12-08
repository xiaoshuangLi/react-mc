import React, {
  useState,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Render from 'react-mc-render';

const traverse = (value = {}, fn) => {
  const {
    relationMap = {},
    rootComponentIds = [],
  } = value;

  const loop = (componentIds = []) => {
    componentIds.forEach((componentId) => {
      const relation = relationMap[componentId] || {};
      const { children = [] } = relation;

      fn && fn(componentId);
      loop(children);
    });
  };

  loop(rootComponentIds);
};

describe('react-mc-render: ', () => {
  it('just render value when did mount', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      relationMap: {
        'root-1': {
          children: ['child-1-1', 'child-1-2'],
        },
        'child-1-2': {
          children: ['child-1-2-2'],
        },
      },
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
        'child-1-1': {
          id: 'child-1-1',
          name: 'p',
        },
        'child-1-2': {
          id: 'child-1-2',
          name: 'div',
        },
        'child-1-2-1': {
          id: 'child-1-2-1',
          name: 'div',
        },
        'child-1-2-2': {
          id: 'child-1-2-2',
          name: 'div',
          props: {
            className: 'render-child',
            'data-key': 'child-1-2-2',
          },
        },
      },
    };

    const element = (
      <Render value={value} />
    );

    ReactDOM.render(element, div);

    traverse(value, (componentId) => {
      const { componentMap = {}, relationMap = {} } = value;
      const { [componentId]: component = {} } = componentMap;
      const { [componentId]: relation = {} } = relationMap;
      const { children: relationChildren = [] } = relation;
      const { name, props = {} } = component;

      const dom = div.querySelector(`#${componentId}`);
      const { tagName = '', children = [] } = dom;

      expect(tagName.toLowerCase()).to.equal(name);
      Object.entries(props).forEach((entry = []) => {
        const [entryKey, entryValue] = entry;

        if (entryKey === 'className') {
          const contained = dom.classList.contains(entryValue);

          expect(contained).to.equal(true);
        } else {
          expect(entryValue).to.equal(dom.getAttribute(entryKey));
        }
      });

      expect(children).to.have.lengthOf(relationChildren.length);
      relationChildren.forEach((childComponentId) => {
        const childDom = dom.querySelector(`#${componentId}>#${childComponentId}`);

        expect(!!childDom).to.equal(true);
      });
    });
  });

  it('just render value when did update', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      relationMap: {
        'root-1': {
          children: ['child-1-1', 'child-1-2'],
        },
        'child-1-2': {
          children: ['child-1-2-1', 'child-1-2-2'],
        },
      },
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
        'child-1-1': {
          id: 'child-1-1',
          name: 'p',
        },
        'child-1-2': {
          id: 'child-1-2',
          name: 'div',
        },
        'child-1-2-1': {
          id: 'child-1-2-1',
          name: 'div',
        },
        'child-1-2-2': {
          id: 'child-1-2-2',
          name: 'div',
          props: {
            className: 'render-child',
            'data-key': 'child-1-2-2',
          },
        },
      },
    };

    const updatedValue = {
      rootComponentIds: ['root-1'],
      relationMap: {
        'root-1': {
          children: ['child-1-2', 'child-1-2-1'],
        },
        'child-1-2': {
          children: ['child-1-1', 'child-1-2-2'],
        },
      },
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
        'child-1-1': {
          id: 'child-1-1',
          name: 'p',
        },
        'child-1-2': {
          id: 'child-1-2',
          name: 'div',
        },
        'child-1-2-1': {
          id: 'child-1-2-1',
          name: 'div',
        },
        'child-1-2-2': {
          id: 'child-1-2-2',
          name: 'div',
          props: {
            className: 'render-child',
            'data-key': 'child-1-2-2',
          },
        },
      },
    };

    const Container = (props = {}) => {
      const { value: propsValue = {}, ...others } = props;

      const [renderValue, setRenderValue] = useState(propsValue);

      useEffect(() => {
        setRenderValue(updatedValue);

        setTimeout(() => {
          traverse(updatedValue, (componentId) => {
            const { componentMap = {}, relationMap = {} } = updatedValue;
            const { [componentId]: component = {} } = componentMap;
            const { [componentId]: relation = {} } = relationMap;
            const { children: relationChildren = [] } = relation;
            const { name, props: componentProps = {} } = component;

            const dom = div.querySelector(`#${componentId}`);
            const { tagName = '', children = [] } = dom;

            expect(tagName.toLowerCase()).to.equal(name);
            Object.entries(componentProps).forEach((entry = []) => {
              const [entryKey, entryValue] = entry;

              if (entryKey === 'className') {
                const contained = dom.classList.contains(entryValue);

                expect(contained).to.equal(true);
              } else {
                expect(entryValue).to.equal(dom.getAttribute(entryKey));
              }
            });

            expect(children).to.have.lengthOf(relationChildren.length);
            relationChildren.forEach((childComponentId) => {
              const childDom = dom.querySelector(`#${componentId}>#${childComponentId}`);

              expect(!!childDom).to.equal(true);
            });
          }, 1000);
          done();
        });
      }, [propsValue]);

      return (
        <Render value={renderValue} {...others} />
      );
    };

    const element = (
      <Container value={value} />
    );

    ReactDOM.render(element, div);
  });

  it('options.getComponentClass work', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'Input',
        },
      },
    };

    const Input = React.forwardRef((props = {}, ref) => {
      return (
        <input ref={ref} {...props} />
      );
    });

    const options = {
      getComponentClass: (component) => {
        return Input;
      },
    };

    const element = (
      <Render value={value} options={options} />
    );

    ReactDOM.render(element, div);

    const dom = div.querySelector('input#root-1');
    expect(!!dom).to.equal(true);
  });

  it('options.render work', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'Input',
        },
      },
    };

    const Input = React.forwardRef((props = {}, ref) => {
      return (
        <input ref={ref} {...props} />
      );
    });

    const options = {
      getComponentClass: (component) => {
        return Input;
      },
      render: (ComponentClass = 'div', component = {}) => (props = {}, ref) => {
        expect(ComponentClass).to.equal(Input);
        expect(component).to.equal(value.componentMap['root-1']);

        return (
          <ComponentClass data-render-item ref={ref} {...props} />
        );
      },
    };

    const element = (
      <Render value={value} options={options} />
    );

    ReactDOM.render(element, div);

    const dom = div.querySelector('input#root-1[data-render-item]');
    expect(!!dom).to.equal(true);
  });

  it('only render when dependencies change (component)', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      relationMap: {
        'root-1': {
          children: ['child-1-1', 'child-1-2'],
        },
      },
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
        'child-1-1': {
          id: 'child-1-1',
          name: 'p',
        },
        'child-1-2': {
          id: 'child-1-2',
          name: 'div',
        },
      },
    };

    const array = [];
    const sample = [
      'root-1',
      'child-1-1',
      'child-1-2',
      'child-1-2',
    ];

    const options = {
      render: (ComponentClass = 'div', component = {}) => (props = {}, ref) => {
        const { id } = props;

        array.push(id);

        return (
          <ComponentClass ref={ref} {...props} />
        );
      },
    };

    const Container = (props = {}) => {
      const { value: propsValue = {}, ...others } = props;

      const [renderValue, setRenderValue] = useState(propsValue);

      useEffect(() => {
        const { componentMap: propsComponentMap = {} } = propsValue;

        const nextRenderValue = {
          ...propsValue,
          componentMap: {
            ...propsComponentMap,
            'child-1-2': {
              id: 'child-1-2',
              name: 'div',
            },
          },
        };

        setRenderValue(nextRenderValue);
        setTimeout(() => {
          expect(array).to.have.lengthOf(sample.length);
          array.forEach((item, index) => {
            expect(array[index]).to.equal(sample[index]);
          });
          done();
        });
      }, [propsValue]);

      return (
        <Render value={renderValue} {...others} />
      );
    };

    const element = (
      <Container value={value} options={options} />
    );

    ReactDOM.render(element, div);
  });

  it('only render when dependencies change (relation)', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      relationMap: {
        'root-1': {
          children: ['child-1-1', 'child-1-2'],
        },
      },
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
        'child-1-1': {
          id: 'child-1-1',
          name: 'p',
        },
        'child-1-2': {
          id: 'child-1-2',
          name: 'div',
        },
      },
    };

    const array = [];
    const sample = [
      'root-1',
      'child-1-1',
      'child-1-2',
      'root-1',
    ];

    const options = {
      render: (ComponentClass = 'div', component = {}) => (props = {}, ref) => {
        const { id } = props;

        array.push(id);

        return (
          <ComponentClass ref={ref} {...props} />
        );
      },
    };

    const Container = (props = {}) => {
      const { value: propsValue = {}, ...others } = props;

      const [renderValue, setRenderValue] = useState(propsValue);

      useEffect(() => {
        const { relationMap: propsRelationMap = {} } = propsValue;

        const nextRenderValue = {
          ...propsValue,
          relationMap: {
            ...propsRelationMap,
            'root-1': {
              children: ['child-1-1', 'child-1-2'],
            },
          },
        };

        setRenderValue(nextRenderValue);
        setTimeout(() => {
          expect(array).to.have.lengthOf(sample.length);
          array.forEach((item, index) => {
            expect(array[index]).to.equal(sample[index]);
          });
          done();
        });
      }, [propsValue]);

      return (
        <Render value={renderValue} {...others} />
      );
    };

    const element = (
      <Container value={value} options={options} />
    );

    ReactDOM.render(element, div);
  });

  it('options.getComponentRenderDependencies work', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const value = {
      rootComponentIds: ['root-1'],
      relationMap: {
        'root-1': {
          children: ['child-1-1', 'child-1-2'],
        },
      },
      componentMap: {
        'root-1': {
          id: 'root-1',
          name: 'div',
        },
        'child-1-1': {
          id: 'child-1-1',
          name: 'p',
        },
        'child-1-2': {
          id: 'child-1-2',
          name: 'div',
        },
      },
    };

    const array = [];
    const sample = [
      'root-1',
      'child-1-1',
      'child-1-2',
      'root-1',
      'child-1-1',
      'child-1-2',
    ];

    const options = {
      getComponentRenderDependencies: () => [{}],
      render: (ComponentClass = 'div', component = {}) => (props = {}, ref) => {
        const { id } = props;

        array.push(id);

        return (
          <ComponentClass ref={ref} {...props} />
        );
      },
    };

    const Container = (props = {}) => {
      const [, setState] = useState();

      useEffect(() => {
        setState({});
        setTimeout(() => {
          expect(array).to.have.lengthOf(sample.length);
          array.forEach((item, index) => {
            expect(array[index]).to.equal(sample[index]);
          });
          done();
        });
      }, []);

      return (
        <Render {...props} />
      );
    };

    const element = (
      <Container value={value} options={options} />
    );

    ReactDOM.render(element, div);
  });
});
