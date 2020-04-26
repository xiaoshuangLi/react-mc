import React, { memo, useMemo, createRef } from 'react';
import classnames from 'classnames';

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
    core,
    highlight,
    options: propsOptions,
    document: propsDocument = document,
    window: propsWindow = window,
    onChange,
    onSelectComponent,
    onKeyDownCapture,
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
    <ConfigProvider value={dndValue}>
      <Container ref={ref} className={cls} {...others}>
        <Render value={value} options={options} />
      </Container>
    </ConfigProvider>
  );
});

Template.propTypes = PropTypes;

Template.defaultProps = {
  document: undefined,
  window: undefined,
  core: undefined,
  highlight: undefined,
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
