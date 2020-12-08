import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Runner from 'react-mc-runner';

describe('react-mc-runner: ', () => {
  it('props.setValue work', (done) => {
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
      const { onChange } = props;

      useEffect(() => {
        onChange && onChange('test');
      }, [onChange]);

      return (
        <input ref={ref} {...props} />
      );
    });

    const options = {
      getComponentClass: (component) => {
        return Input;
      },
      getComponentPropsSchema: (component) => {
        return {
          title: 'Input',
          type: 'object',
          description: '',
          properties: {
            value: {
              type: 'string',
              default: '',
            },
            onChange: {
              type: 'func',
              params: ['value'],
            },
          },
        };
      },
    };

    const setValue = (fn) => {
      const nextValue = fn();
      const { componentMap = {} } = nextValue;
      const { 'root-1': component = {} } = componentMap;
      const { props: { value: propsValue } = {} } = component;

      expect(propsValue).to.equal('test');
      done();
    };

    const element = (
      <Runner
        value={value}
        options={options}
        setValue={setValue}
      />
    );

    ReactDOM.render(element, div);
  });
});
