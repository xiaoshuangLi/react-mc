import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useDragAndHover, ConfigContext } from 'react-mc-dnd';

import { useEventCallback } from 'shared/hooks';

import { withMode } from './utils/hocs';
import { ExtractableContext, useMode } from './utils/hooks';
import { createDndContainer, useDndValue } from './utils/dnd';

import Creator from './Creator';
import Creation from './Creation';
import Extractions from './Extractions';

const { Provider: ConfigProvider } = ConfigContext;

const { Provider: ExtractableProvider } = ExtractableContext;

const useValue = (props = {}) => {
  const {
    value: propsValue,
    onChange: propsOnChange,
  } = props;

  const [state, setState] = useState(propsValue);

  const value = useMemo(() => {
    return state || [];
  }, [state]);

  const setValue = useMemo(() => {
    return propsOnChange
      ? setState
      : undefined;
  }, [propsOnChange, setState]);

  const onChangeState = useEventCallback(() => {
    if (state === propsValue) {
      return;
    }

    propsOnChange && propsOnChange(state);
  });

  const onChangePropsValue = useEventCallback(() => {
    if (!propsValue) {
      return;
    }

    setState(propsValue);
  });

  useEffect(
    () => onChangeState(),
    [state, onChangeState],
  );

  useEffect(
    () => onChangePropsValue(),
    [propsValue, onChangePropsValue],
  );

  return [value, setValue];
};

const DragAndHoverContainer = createDndContainer(
  useDragAndHover,
);

const Creations = React.forwardRef((props = {}, ref) => {
  const {
    className,
    placeholder = '',
    value: a,
    onChange: b,
    children,
    ...others
  } = props;

  const mode = useMode();
  const dndValue = useDndValue(props);
  const [value, setValue] = useValue(props);

  const { custom } = useContext(ConfigContext);

  const cls = classnames({
    'workspace-creations': true,
    [className]: !!className,
  });

  const onCreate = useEventCallback((current) => {
    const setter = (prevValue = []) => {
      return prevValue.concat(current);
    };

    setValue && setValue(setter);
  });

  const renderCreations = () => {
    return value.map((item = {}, index) => {
      let onChange;
      let onClickDelete;

      if (setValue) {
        onChange = (current) => {
          const setter = (prevValue) => {
            return prevValue.map((prevItem = {}) => {
              return prevItem === item
                ? { ...item, value: current }
                : prevItem;
            });
          };

          setValue && setValue(setter);
        };

        onClickDelete = () => {
          const setter = (prevValue) => {
            const result = prevValue.slice();

            result.splice(index, 1);
            return result;
          };

          setValue && setValue(setter);
        };
      }

      const renderTools = () => {
        if (!setValue) {
          return null;
        }

        if (mode) {
          return null;
        }

        return (
          <div className="creations-tools">
            <div className="tools-container">
              <div className="delete" onClick={onClickDelete} />
            </div>
          </div>
        );
      };

      const renderCreation = () => {
        return (
          <DragAndHoverContainer creation={item}>
            <Creation className="creations-item" onChange={onChange} {...item} />
          </DragAndHoverContainer>
        );
      };

      return (
        <Fragment key={index}>
          { renderTools() }
          { renderCreation() }
        </Fragment>
      );
    });
  };

  const renderCreator = () => {
    if (!setValue) {
      return null;
    }

    if (mode) {
      return null;
    }

    return (
      <Creator
        className="creations-creator"
        placeholder={placeholder}
        onCreate={onCreate}
      />
    );
  };

  const renderChildren = () => {
    return (
      <ExtractableProvider value>
        { children }
      </ExtractableProvider>
    );
  };

  let content = (
    <Extractions>
      { renderCreations() }
      { renderCreator() }
      { renderChildren() }
    </Extractions>
  );

  if (mode) {
    return content;
  }

  content = (
    <div ref={ref} className={cls} {...others}>
      { content }
    </div>
  );

  if (custom) {
    return content;
  }

  return (
    <ConfigProvider value={dndValue}>
      { content }
    </ConfigProvider>
  );
});

Creations.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.any,
  ),
  onChange: PropTypes.func,
};

Creations.defaultProps = {
  placeholder: '',
  value: [],
  onChange: undefined,
};

export default withMode(Creations);
