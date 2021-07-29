import React, {
  useMemo,
  useEffect,
  Component,
} from 'react';
import classnames from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import ReactMCWorkspace, {
  Selector,
  Creation,
  Creations,
  Collection,
  Definition,
  Decoration,
  ArgumentInput,
  ArgumentSelect,
  ArgumentCreations,
} from 'react-mc-workspace';

import { useArgument } from './hooks';

const initialComponentValue = ['input-name'];
const initialComponentPropValue = ['input-name', '["value"]'];

const componentOptions = [
  { label: '姓名（输入框）', value: 'input-name' },
  { label: '年龄（输入框）', value: 'input-age' },
  { label: '性别（输入框）', value: 'input-sex' },
  { label: '说明（输入框）', value: 'textarea' },
  { label: '文本', value: 'text' },
  { label: '按钮', value: 'button' },
  { label: '表格', value: 'table' },
];

const componentPropOptions = [
  { label: '值', value: '["value"]' },
  { label: '标题', value: '["title"]' },
  { label: '占位符', value: '["placeholder"]' },
];

const interfaceOptions = [
  { label: '人员详情', value: 'person-detail' },
  { label: '人员列表', value: 'person-list' },
];

const OnPageWillMountCreation = (props = {}) => {
  return (
    <Decoration icon="🪟" title="当页面打开时" />
  );
};

const OnClickCreation = (props = {}) => {
  const [component, setComponent] = useArgument(props, 0);

  useEffect(() => {
    if (component) {
      return;
    }

    const [option = {}] = componentOptions;
    const { value } = option;

    setTimeout(() => {
      value && setComponent && setComponent(value);
    });
  }, []);

  const title = (
    <>
      当点击
      <ArgumentSelect
        placeholder="组件"
        options={componentOptions}
        value={component}
        onChange={setComponent}
      />
      时
    </>
  );

  return (
    <Decoration icon="👆" title={title} />
  );
};

const OnChangeComponentPropCreation = (props = {}) => {
  const [component, setComponent] = useArgument(props, 0);
  const [componentProp, setComponentProp] = useArgument(props, 1);

  const title = (
    <>
      当
      <ArgumentSelect
        placeholder="组件"
        options={componentOptions}
        value={component}
        onChange={setComponent}
      />
      <ArgumentSelect
        placeholder="属性"
        options={componentPropOptions}
        value={componentProp}
        onChange={setComponentProp}
      />
      修改时
    </>
  );

  return (
    <Decoration icon="🎳" title={title} />
  );
};

const IfElseCreation = (props = {}) => {
  const [condition, setCondition] = useArgument(props, 0);
  const [ifMissions, setIfMissions] = useArgument(props, 1);
  const [elseMissions, setElseMissions] = useArgument(props, 2);

  const title = (
    <>
      如果
      <ArgumentInput
        placeholder="条件"
        value={condition}
        onChange={setCondition}
      />
      通过之后执行
    </>
  );

  return (
    <>
      <Decoration icon="🤔" title={title} />
      <ArgumentCreations
        placeholder="添加任务"
        value={ifMissions}
        onChange={setIfMissions}
      />
      <Decoration title="否则" />
      <ArgumentCreations
        placeholder="添加任务"
        value={elseMissions}
        onChange={setElseMissions}
      />
    </>
  );
};

const IfCreation = (props = {}) => {
  const [condition, setCondition] = useArgument(props, 0);
  const [ifMissions, setIfMissions] = useArgument(props, 1);

  const title = (
    <>
      如果
      <ArgumentInput
        placeholder="条件"
        value={condition}
        onChange={setCondition}
      />
      通过之后执行
    </>
  );

  return (
    <>
      <Decoration icon="☝️" title={title} />
      <ArgumentCreations
        placeholder="添加任务"
        value={ifMissions}
        onChange={setIfMissions}
      />
    </>
  );
};

const StopCreation = (props = {}) => {
  return (
    <Decoration icon="🛑" title="终止命令" />
  );
};

const AlertCreation = (props = {}) => {
  const {
    value: propsValue,
    onChange: propsOnChange,
  } = props;

  const value = useMemo(() => {
    if (propsValue) {
      return [''];
    }

    if (!propsValue.length) {
      return [''];
    }

    if (!propsOnChange) {
      return propsValue;
    }

    const last = propsValue[propsValue.length - 1];

    if (!last) {
      return propsValue;
    }

    return propsValue.concat('');
  }, [propsValue, propsOnChange]);

  const items = value.map((item, index) => {
    let onChange;

    if (propsOnChange) {
      onChange = (current) => {
        const nextValue = value.slice();

        nextValue[index] = current;
        propsOnChange && propsOnChange(nextValue);
      };
    }

    return (
      <ArgumentInput
        placeholder="文本"
        key={index}
        value={item}
        onChange={onChange}
      />
    );
  });

  const title = (
    <>
      提示
      { items }
    </>
  );

  return (
    <Decoration icon="📢" title={title} />
  );
};

const SetComponentPropCreation = (props = {}) => {
  const [component, setComponent] = useArgument(props, 0);
  const [componentProp, setComponentProp] = useArgument(props, 1);
  const [componentPropValue, setComponentPropValue] = useArgument(props, 2);

  const title = (
    <>
      设置
      <ArgumentSelect
        placeholder="组件"
        options={componentOptions}
        value={component}
        onChange={setComponent}
      />
      <ArgumentSelect
        placeholder="属性"
        options={componentPropOptions}
        value={componentProp}
        onChange={setComponentProp}
      />
      <ArgumentInput
        placeholder="数据"
        value={componentPropValue}
        onChange={setComponentPropValue}
      />
    </>
  );

  return (
    <Decoration icon="✏️" title={title} />
  );
};

const FetchCreation = (props = {}) => {
  const [inteface, setInterface] = useArgument(props, 0);

  const title = (
    <>
      请求
      <ArgumentSelect
        placeholder="接口"
        options={interfaceOptions}
        value={inteface}
        onChange={setInterface}
      />
    </>
  );

  return (
    <Decoration icon="🚀" title={title} />
  );
};

const QTCreation = (props = {}) => {
  const [source, setSource] = useArgument(props, 0);
  const [target, setTarget] = useArgument(props, 1);

  const title = (
    <>
      <ArgumentInput
        placeholder="输入数据"
        value={source}
        onChange={setSource}
      />
      大于
      <ArgumentInput
        placeholder="比较数据"
        value={target}
        onChange={setTarget}
      />
    </>
  );

  return (
    <Decoration icon="≥" title={title} />
  );
};

const LTCreation = (props = {}) => {
  const [source, setSource] = useArgument(props, 0);
  const [target, setTarget] = useArgument(props, 1);

  const title = (
    <>
      <ArgumentInput
        placeholder="输入数据"
        value={source}
        onChange={setSource}
      />
      小于
      <ArgumentInput
        placeholder="比较数据"
        value={target}
        onChange={setTarget}
      />
    </>
  );

  return (
    <Decoration icon="≤" title={title} />
  );
};

const EqualCreation = (props = {}) => {
  const [source, setSource] = useArgument(props, 0);
  const [target, setTarget] = useArgument(props, 1);

  const title = (
    <>
      <ArgumentInput
        placeholder="输入数据"
        value={source}
        onChange={setSource}
      />
      等于
      <ArgumentInput
        placeholder="比较数据"
        value={target}
        onChange={setTarget}
      />
    </>
  );

  return (
    <Decoration icon="=" title={title} />
  );
};

const QueryParamterCreation = (props = {}) => {
  const [attribute, setAttribute] = useArgument(props, 0);

  const title = (
    <>
      链接
      <ArgumentInput
        placeholder="参数"
        value={attribute}
        onChange={setAttribute}
      />
    </>
  );

  return (
    <Decoration icon="🥄" title={title} />
  );
};

const GetComponentPropCreation = (props = {}) => {
  const [component, setComponent] = useArgument(props, 0);
  const [componentProp, setComponentProp] = useArgument(props, 1);

  const title = (
    <>
      读取
      <ArgumentSelect
        placeholder="组件"
        options={componentOptions}
        value={component}
        onChange={setComponent}
      />
      <ArgumentSelect
        placeholder="属性"
        options={componentPropOptions}
        value={componentProp}
        onChange={setComponentProp}
      />
    </>
  );

  return (
    <Decoration icon="📝" title={title} />
  );
};

const KEY = 'react-mc-state';
const initialState = JSON.parse(window.localStorage.getItem(KEY) || 'null');

class Workspace extends Component {
  constructor(props) {
    super(props);

    this.state = initialState || {
      groups: [],
      selected: [],
    };
  }

  componentDidUpdate() {
    const json = JSON.stringify(this.state);
    window.localStorage.setItem(KEY, json);
  }

  onChange = (value = []) => {
    this.setState({ value });
  };

  onChangeSelectedEventValue = (value) => {
    const { selected: stateSelected = [] } = this.state;

    const [stateEvent, ...missions] = stateSelected;
    const event = { ...stateEvent, value };
    const selected = [event, ...missions];

    this._setSelected(selected);
  };

  onChangeSelectedMissions = (missions = []) => {
    const { selected: stateSelected = [] } = this.state;

    const [event] = stateSelected;
    const selected = [event, ...missions];

    this._setSelected(selected);
  };

  onChangeSelector = (creation = {}) => {
    const {
      groups: stateGroups = [],
      selected: stateSelected = [],
    } = this.state;

    if (stateSelected.length) {
      const selected = [...stateSelected, creation];

      this._setSelected(selected);
    } else {
      const current = [creation];
      const groups = [...stateGroups, current];

      this.setState({ groups });
    }
  }

  onClickBack = () => {
    this.setState({ selected: [] });
  }

  _setSelected = (selected = []) => {
    this.setState((prevState = {}) => {
      const {
        groups: prevGroups = [],
        selected: prevSelected = [],
      } = prevState;

      const groups = prevGroups.map((item) => {
        return item === prevSelected
          ? selected
          : item;
      });

      return { selected, groups };
    });
  }

  renderCollections() {
    const { value } = this.state;

    return (
      <>
        <Collection type="event" title="事件">
          <Definition trigger type="on_page_will_mount" ComponentClass={OnPageWillMountCreation} />
          <Definition trigger type="on_click" value={initialComponentValue} ComponentClass={OnClickCreation} />
          <Definition trigger type="on_change_component_prop" value={initialComponentPropValue} ComponentClass={OnChangeComponentPropCreation} />
        </Collection>
        <Collection type="data" title="数据">
          <Definition output type="query_parameter" ComponentClass={QueryParamterCreation} />
          <Definition output type="get_component_prop" value={initialComponentPropValue} ComponentClass={GetComponentPropCreation} />
          <Definition output type="fetch" ComponentClass={FetchCreation} />
        </Collection>
        <Collection type="control" title="控制">
          <Definition type="if_else" ComponentClass={IfElseCreation} />
          <Definition type="if" ComponentClass={IfCreation} />
        </Collection>
        <Collection type="command" title="命令">
          <Definition type="set_component_prop" value={initialComponentPropValue} ComponentClass={SetComponentPropCreation} />
          <Definition type="alert" ComponentClass={AlertCreation} />
          <Definition type="stop" ComponentClass={StopCreation} />
        </Collection>
        <Collection type="operator" title="计算">
          <Definition output type="gt" ComponentClass={QTCreation} />
          <Definition output type="lt" ComponentClass={LTCreation} />
          <Definition output type="equal" ComponentClass={EqualCreation} />
        </Collection>
      </>
    );
  }

  renderCreations() {
    const { selected = [], groups = [] } = this.state;

    const items = groups.map((group = [], index) => {
      const [first = {}, ...rest] = group;

      const onChange = (value) => {
        this.setState((prevState = {}) => {
          const { groups: prevGroups = [] } = prevState;

          const current = { ...first, value };
          const nextGroup = [current, ...rest];
          const nextGroups = prevGroups.map((item = {}) => {
            return item === group ? nextGroup : item;
          });

          return { groups: nextGroups };
        });
      };

      const onClickSelect = () => {
        this._setSelected(group);
      };

      const onClickDelete = (e) => {
        e.stopPropagation();

        this.setState((prevState = {}) => {
          const { groups: prevGroups = [] } = prevState;

          const nextGroups = prevGroups.filter((item = {}) => {
            return item !== group;
          });

          return { groups: nextGroups };
        });
      };

      return (
        <div className="creations-item" key={index} onClick={onClickSelect}>
          <div className="item-minimal">
            <div className="minimal-trigger">
              <Creation mode="icon" {...first} />
            </div>
            <div className="minimal-missions">
              <Creations mode="icon" value={rest} />
            </div>
          </div>
          <div className="item-title">
            <Creation mode="text" {...first} onChange={onChange} />
          </div>
          <div className="item-description">
            <Creations mode="text" value={rest} />
          </div>
          <div className="item-delete" onClick={onClickDelete} />
        </div>
      );
    });

    if (selected.length) {
      return null;
    }

    return (
      <div className="workspace-redner-creations">
        { items }
      </div>
    );
  }

  renderSelected = () => {
    const { selected = [] } = this.state;

    if (!selected.length) {
      return null;
    }

    const [event, ...missions] = selected;

    return (
      <div className="workspace-redner-selected">
        <div className="selected-header">
          <div className="back" onClick={this.onClickBack}>
            👈 返回列表
          </div>
          <div className="title">
            <Creation
              mode="article"
              {...event}
              onChange={this.onChangeSelectedEventValue}
            />
          </div>
        </div>
        <div className="selected-body">
          <Creations
            placeholder="添加任务"
            value={missions}
            onChange={this.onChangeSelectedMissions}
          />
        </div>
      </div>
    );
  }

  renderSelector() {
    const { selected = [] } = this.state;

    const conditions = selected.length
      ? [{ trigger: undefined }]
      : [{ trigger: true }];

    return (
      <div className="workspace-redner-selector">
        <Selector
          compact
          conditions={conditions}
          onChange={this.onChangeSelector}
        />
      </div>
    );
  }

  render() {
    const { className } = this.props;

    const cls = classnames({
      'pages-workspace-render': true,
      [className]: !!className,
    });

    return (
      <DndProvider backend={HTML5Backend} context={window}>
        <ReactMCWorkspace className={cls}>
          { this.renderCollections() }
          { this.renderCreations() }
          { this.renderSelected() }
          { this.renderSelector() }
        </ReactMCWorkspace>
      </DndProvider>
    );
  }
}

export default Workspace;
