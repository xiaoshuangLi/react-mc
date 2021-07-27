import React, {
  useRef,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import {
  ExtractableContext,
  DefaultModeContext,
  StateContext,
  useArgument,
  useMode,
} from './utils/hooks';

import Sponsor from './Sponsor';
import Creation from './Creation';
import Extractions from './Extractions';

const { Provider: ExtractableProvider } = ExtractableContext;
const { Provider: DefaultModeProvider } = DefaultModeContext;

const uselesses = [undefined, null, ''];

const isUseful = (value) => {
  const included = uselesses.includes(value);

  return !included;
};

const useSelected = () => {
  const [state = {}, setState] = useContext(StateContext);
  const { selected } = state;

  const setSelected = useEventCallback((nextSelected) => {
    setState((prevState = {}) => {
      return { ...prevState, selected: nextSelected };
    });
  });

  return [selected, setSelected];
};

const ArgumentInput = React.forwardRef((props = {}, ref) => {
  const {
    className,
    placeholder,
    value: propsValue,
    children,
    ...others
  } = props;

  const { onChange: propsOnChange } = others;
  const { onClick: propsOnClick, ...rest } = others;

  const id = useRef();
  const mode = useMode();
  const [selected, setSelected] = useSelected();

  const cls = useMemo(() => {
    const useful = isUseful(propsValue);

    const componentClassName = mode
      ? `workspace-argument-input-for-${mode}`
      : 'workspace-argument-input';

    return classnames({
      [className]: !!className,
      [componentClassName]: !!componentClassName,
      'workspace-argument-placeholder': !useful,
      'workspace-argument-selected': selected === id,
    });
  }, [className, propsValue, id, mode, selected]);

  const selectable = useMemo(() => {
    if (propsValue === null) {
      return true;
    }

    return typeof propsValue !== 'object';
  }, [propsValue]);

  const onKeyDown = useEventCallback((e = {}) => {
    const { which, target = {} } = e;
    const { tagName } = target;

    if (tagName === 'INPUT') {
      return;
    }

    if (selected !== id) {
      return;
    }

    if (which !== 8) {
      return;
    }

    setSelected(undefined);
    propsOnChange && propsOnChange('');
  });

  const onClickCreation = useEventCallback((e = {}) => {
    e.stopPropagation();

    setSelected(id);
    propsOnClick && propsOnClick(e);
  });

  const onChangeCreation = useEventCallback((current) => {
    const value = {
      ...propsValue,
      value: current,
    };

    propsOnChange && propsOnChange(value);
  });

  const renderSponsor = () => {
    if (!selectable) {
      return null;
    }

    const useful = isUseful(propsValue);

    const content = useful
      ? propsValue
      : placeholder;

    const ComponentClass = propsOnChange
      ? Sponsor
      : 'span';

    const componentProps = propsOnChange
      ? { ...others, output: true }
      : others;

    return (
      <ComponentClass ref={ref} className={cls} {...componentProps}>
        { content }
      </ComponentClass>
    );
  };

  const renderCreation = () => {
    if (selectable) {
      return null;
    }

    return (
      <span ref={ref} className={cls} onClick={onClickCreation} {...rest}>
        <Creation {...propsValue} onChange={onChangeCreation} />
      </span>
    );
  };

  const renderChildren = () => {
    return (
      <ExtractableProvider value>
        { children }
      </ExtractableProvider>
    );
  };

  useArgument(props);

  useEffect(() => {
    if (!selected) {
      return;
    }

    document.addEventListener('keydown', onKeyDown);
    () => document.removeEventListener('keydown', onKeyDown);
  }, [selected, onKeyDown]);

  return (
    <Extractions>
      <DefaultModeProvider value="article">
        { renderSponsor() }
        { renderCreation() }
        { renderChildren() }
      </DefaultModeProvider>
    </Extractions>
  );
});

ArgumentInput.propTypes = {
  placeholder: PropTypes.node,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

ArgumentInput.defaultProps = {
  placeholder: '',
  value: '',
  onChange: undefined,
};

export default ArgumentInput;
