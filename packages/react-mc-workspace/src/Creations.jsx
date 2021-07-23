import React, {
  useMemo,
  useState,
  useEffect,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { useEventCallback } from 'shared/hooks';

import { ExtractableContext, useMode, withMode } from './utils/hooks';

import Creator from './Creator';
import Creation from './Creation';
import Extractions from './Extractions';

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
  const [value, setValue] = useValue(props);

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
          <Creation className="creations-item" onChange={onChange} {...item} />
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

  if (mode) {
    return (
      <Extractions>
        { renderCreations() }
        { renderCreator() }
        { renderChildren() }
      </Extractions>
    );
  }

  return (
    <Extractions>
      <div ref={ref} className={cls} {...others}>
        { renderCreations() }
        { renderCreator() }
        { renderChildren() }
      </div>
    </Extractions>
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
