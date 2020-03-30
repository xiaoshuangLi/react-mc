import React, { memo, useMemo, createRef } from 'react';
import classnames from 'classnames';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Render from 'react-mc-render';
import { ConfigContext } from 'react-mc-dnd';

import defaultOptions from './utils/options';
import {
  useOptions,
  useDndValue,
  useTriggers,
} from './utils/hooks';

import PropTypes from './PropTypes';
import Container from './Container';

const { Provider: ConfigProvider } = ConfigContext;

const Template = React.forwardRef((props = {}, ref) => {
  const {
    className,
    value,
    selectedComponent,
    options: propsOptions,
    onChange,
    onSelectComponent,
    ...others
  } = props;

  const cls = classnames({
    'react-mc-template-render': true,
    [className]: !!className,
  });

  ref = useMemo(() => {
    return ref || createRef();
  }, [ref]);

  useTriggers(props, ref);

  const options = useOptions(props);
  const dndValue = useDndValue(props);

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <ConfigProvider value={dndValue}>
        <Container ref={ref} className={cls} {...others}>
          <Render
            value={value}
            options={options}
            selectedComponent={selectedComponent}
          />
        </Container>
      </ConfigProvider>
    </DndProvider>
  );
});

Template.propTypes = PropTypes;

Template.defaultProps = {
  options: defaultOptions,
  value: {
    rootComponentIds: [],
    componentMap: {},
    relationMap: {},
  },
  selectedComponent: {},
  onChange: undefined,
  onSelectComponent: undefined,
};

export default memo(Template);
