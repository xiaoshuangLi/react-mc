import React, {
  useMemo,
  useEffect,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { useEventCallback } from 'shared/hooks';

import Workspace, { Definition } from 'react-mc-workspace';
import { CollectionsContext } from 'react-mc-workspace/src/utils/hooks';

describe('react-mc-workspace: ', () => {
  it('Definition save to context', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const target = [
      {
        root: true,
        definitions: [
          {
            type: 'useful_definition_1',
            ComponentClass: 'div',
            output: false,
          },
          {
            type: 'useful_definition_2',
            ComponentClass: 'div',
            output: false,
          },
        ],
      },
    ];

    const Test = () => {
      const [collections = []] = useContext(CollectionsContext);

      const length = useMemo(() => {
        const [collection = {}] = collections;
        const { definitions = [] } = collection;

        return definitions.length;
      }, [collections]);

      const test = useEventCallback(() => {
        if (!length) {
          return;
        }

        expect(collections.length).to.equal(target.length);
        expect(collections[0]).to.deep.include(target[0]);
        done();
      });

      useEffect(
        () => test(),
        [length, test],
      );

      return null;
    };

    const element = (
      <Workspace>
        <Definition type="without_component_class" />
        <Definition ComponentClass="div" />
        <Definition type="useful_definition_1" ComponentClass="div" />
        <Definition type="useful_definition_2" ComponentClass="div" />
        <Test />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Definition clear when unmont', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const targetBeforeUnmount = [
      {
        root: true,
        definitions: [
          {
            type: 'useful_definition_1',
            ComponentClass: 'div',
            output: false,
          },
          {
            type: 'useful_definition_2',
            ComponentClass: 'div',
            output: false,
          },
        ],
      },
    ];

    const targetAfterUnmount = [
      {
        root: true,
        definitions: [
          {
            type: 'useful_definition_1',
            ComponentClass: 'div',
            output: false,
          },
        ],
      },
    ];

    let count = 0;

    const Test = () => {
      const [collections = []] = useContext(CollectionsContext);

      const length = useMemo(() => {
        const [collection = {}] = collections;
        const { definitions = [] } = collection;

        return definitions.length;
      }, [collections]);

      const test = useEventCallback(() => {
        if (!length) {
          return;
        }

        if (count === 0) {
          expect(collections.length).to.equal(targetBeforeUnmount.length);
          expect(collections[0]).to.deep.include(targetBeforeUnmount[0]);
          count += 1;
        } else if (count === 1) {
          expect(collections.length).to.equal(targetAfterUnmount.length);
          expect(collections[0]).to.deep.include(targetAfterUnmount[0]);
          done();
        }
      });

      useEffect(
        () => test(),
        [length, test],
      );

      return null;
    };

    const elementBeforeUnmount = (
      <Workspace>
        <Definition type="useful_definition_1" ComponentClass="div" />
        <Definition type="useful_definition_2" ComponentClass="div" />
        <Test key="test" />
      </Workspace>
    );

    const elementAfterUnmount = (
      <Workspace>
        <Definition type="useful_definition_1" ComponentClass="div" />
        <Test key="test" />
      </Workspace>
    );

    setTimeout(() => {
      ReactDOM.render(elementAfterUnmount, div);
    });

    ReactDOM.render(elementBeforeUnmount, div);
  });

  it('Definition render whit custom props', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const target = [
      {
        root: true,
        definitions: [
          {
            type: 'useful_definition',
            ComponentClass: 'div',
            string: 'string',
            output: true,
            boolean: true,
            number: 0,
            array: [{ key: 'value' }],
            object: { key: 'value' },
          },
        ],
      },
    ];

    const Test = () => {
      const [collections = []] = useContext(CollectionsContext);

      const length = useMemo(() => {
        const [collection = {}] = collections;
        const { definitions = [] } = collection;

        return definitions.length;
      }, [collections]);

      const test = useEventCallback(() => {
        if (!length) {
          return;
        }

        expect(collections.length).to.equal(target.length);
        expect(collections[0]).to.deep.include(target[0]);
        done();
      });

      useEffect(
        () => test(),
        [length, test],
      );

      return null;
    };

    const element = (
      <Workspace>
        <Definition
          output
          boolean
          number={0}
          string="string"
          object={{ key: 'value' }}
          array={[{ key: 'value' }]}
          type="useful_definition"
          ComponentClass="div"
        />
        <Test />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
