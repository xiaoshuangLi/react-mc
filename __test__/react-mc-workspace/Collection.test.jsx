import React, {
  useMemo,
  useEffect,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import { useEventCallback } from 'shared/hooks';

import Workspace, { Collection, Definition } from 'react-mc-workspace';
import { CollectionsContext } from 'react-mc-workspace/src/utils/hooks';

describe('react-mc-workspace: ', () => {
  it('Collection save to context', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const target = [
      {
        root: false,
        type: 'test',
        title: '测试',
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
      {
        root: false,
        type: 'test_1',
        title: '测试_一',
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
        expect(collections[1]).to.deep.include(target[1]);
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
        <Collection type="test" title="测试">
          <Definition type="useful_definition_1" ComponentClass="div" />
          <Definition type="useful_definition_2" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="useful_definition_1" ComponentClass="div" />
          <Definition type="useful_definition_2" ComponentClass="div" />
        </Collection>
        <Collection title="测试_一">
          <Definition type="useful_definition_1" ComponentClass="div" />
          <Definition type="useful_definition_2" ComponentClass="div" />
        </Collection>
        <Test />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Collection clear when unmont', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const targetBeforeUnmount = [
      {
        root: false,
        type: 'test',
        title: '测试',
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
      {
        root: false,
        type: 'test_1',
        title: '测试_一',
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
        root: false,
        type: 'test',
        title: '测试',
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

    let count = 0;

    const Test = () => {
      const [collections = []] = useContext(CollectionsContext);

      const length = useMemo(() => {
        return collections.length;
      }, [collections]);

      const test = useEventCallback(() => {
        if (!length) {
          return;
        }

        if (count === 0) {
          expect(collections.length).to.equal(targetBeforeUnmount.length);
          expect(collections[0]).to.deep.include(targetBeforeUnmount[0]);
          expect(collections[1]).to.deep.include(targetBeforeUnmount[1]);
        } else if (count === 1) {
          expect(collections.length).to.equal(targetAfterUnmount.length);
          expect(collections[0]).to.deep.include(targetAfterUnmount[0]);
          done();
        }

        count += 1;
      });

      useEffect(
        () => test(),
        [length, test],
      );

      return null;
    };

    const elementBeforeUnmount = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="useful_definition_1" ComponentClass="div" />
          <Definition type="useful_definition_2" ComponentClass="div" />
        </Collection>
        <Collection type="test_1" title="测试_一">
          <Definition type="useful_definition_1" ComponentClass="div" />
          <Definition type="useful_definition_2" ComponentClass="div" />
        </Collection>
        <Test key="test" />
      </Workspace>
    );

    const elementAfterUnmount = (
      <Workspace>
        <Collection type="test" title="测试">
          <Definition type="useful_definition_1" ComponentClass="div" />
          <Definition type="useful_definition_2" ComponentClass="div" />
        </Collection>
        <Test key="test" />
      </Workspace>
    );

    setTimeout(() => {
      ReactDOM.render(elementAfterUnmount, div);
    }, 1000);

    ReactDOM.render(elementBeforeUnmount, div);
  });
});
