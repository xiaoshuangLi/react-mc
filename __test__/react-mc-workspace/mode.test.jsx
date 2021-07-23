import React, {
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

import Workspace, {
  Creation,
  Creations,
  Definition,
  Decoration,
} from 'react-mc-workspace';

describe('react-mc-workspace: ', () => {
  it('Creation with mode "icon"', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'icon';

    const Icon = () => {
      useEffect(() => {
        source += 'icon';
      }, []);

      return null;
    };

    const Title = () => {
      useEffect(() => {
        source += 'title';
      }, []);

      return null;
    };

    const Content = () => {
      useEffect(() => {
        source += 'content';
      }, []);

      return null;
    };

    const Test = () => {
      const icon = (<Icon />);
      const title = (<Title />);

      useEffect(() => {
        expect(source).to.equal(target);
        done();
      }, []);

      return (
        <Decoration icon={icon} title={title}>
          <Content />
        </Decoration>
      );
    };

    const element = (
      <Workspace>
        <Definition type="test" ComponentClass={Test} />
        <Creation mode="icon" type="test" />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creation with mode "text"', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'title';

    const Icon = () => {
      useEffect(() => {
        source += 'icon';
      }, []);

      return null;
    };

    const Title = () => {
      useEffect(() => {
        source += 'title';
      }, []);

      return null;
    };

    const Content = () => {
      useEffect(() => {
        source += 'content';
      }, []);

      return null;
    };

    const Test = () => {
      const icon = (<Icon />);
      const title = (<Title />);

      useEffect(() => {
        expect(source).to.equal(target);
        done();
      }, []);

      return (
        <Decoration icon={icon} title={title}>
          <Content />
        </Decoration>
      );
    };

    const element = (
      <Workspace>
        <Definition type="test" ComponentClass={Test} />
        <Creation mode="text" type="test" />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creation with mode "article"', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'icontitle';

    const Icon = () => {
      useEffect(() => {
        source += 'icon';
      }, []);

      return null;
    };

    const Title = () => {
      useEffect(() => {
        source += 'title';
      }, []);

      return null;
    };

    const Content = () => {
      useEffect(() => {
        source += 'content';
      }, []);

      return null;
    };

    const Test = () => {
      const icon = (<Icon />);
      const title = (<Title />);

      useEffect(() => {
        expect(source).to.equal(target);
        done();
      }, []);

      return (
        <Decoration icon={icon} title={title}>
          <Content />
        </Decoration>
      );
    };

    const element = (
      <Workspace>
        <Definition type="test" ComponentClass={Test} />
        <Creation mode="article" type="test" />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations with mode "icon"', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'icon';

    const value = [{ type: 'test' }];

    const Icon = () => {
      useEffect(() => {
        source += 'icon';
      }, []);

      return null;
    };

    const Title = () => {
      useEffect(() => {
        source += 'title';
      }, []);

      return null;
    };

    const Content = () => {
      useEffect(() => {
        source += 'content';
      }, []);

      return null;
    };

    const Test = () => {
      const icon = (<Icon />);
      const title = (<Title />);

      useEffect(() => {
        expect(source).to.equal(target);
        done();
      }, []);

      return (
        <Decoration icon={icon} title={title}>
          <Content />
        </Decoration>
      );
    };

    const element = (
      <Workspace>
        <Definition type="test" ComponentClass={Test} />
        <Creations mode="icon" value={value} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations with mode "text"', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'title';

    const value = [{ type: 'test' }];

    const Icon = () => {
      useEffect(() => {
        source += 'icon';
      }, []);

      return null;
    };

    const Title = () => {
      useEffect(() => {
        source += 'title';
      }, []);

      return null;
    };

    const Content = () => {
      useEffect(() => {
        source += 'content';
      }, []);

      return null;
    };

    const Test = () => {
      const icon = (<Icon />);
      const title = (<Title />);

      useEffect(() => {
        expect(source).to.equal(target);
        done();
      }, []);

      return (
        <Decoration icon={icon} title={title}>
          <Content />
        </Decoration>
      );
    };

    const element = (
      <Workspace>
        <Definition type="test" ComponentClass={Test} />
        <Creations mode="text" value={value} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });

  it('Creations with mode "article"', (done) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    let source = '';
    const target = 'icontitle';

    const value = [{ type: 'test' }];

    const Icon = () => {
      useEffect(() => {
        source += 'icon';
      }, []);

      return null;
    };

    const Title = () => {
      useEffect(() => {
        source += 'title';
      }, []);

      return null;
    };

    const Content = () => {
      useEffect(() => {
        source += 'content';
      }, []);

      return null;
    };

    const Test = () => {
      const icon = (<Icon />);
      const title = (<Title />);

      useEffect(() => {
        expect(source).to.equal(target);
        done();
      }, []);

      return (
        <Decoration icon={icon} title={title}>
          <Content />
        </Decoration>
      );
    };

    const element = (
      <Workspace>
        <Definition type="test" ComponentClass={Test} />
        <Creations mode="article" value={value} />
      </Workspace>
    );

    ReactDOM.render(element, div);
  });
});
