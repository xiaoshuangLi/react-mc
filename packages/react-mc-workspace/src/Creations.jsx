import React, {
  useMemo,
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

const Creations = React.forwardRef((props = {}, ref) => {
  const {
    className,
    placeholder = '',
    value: propsValue,
    onChange: propsOnChange,
    children,
    ...others
  } = props;

  const mode = useMode();

  const cls = classnames({
    'workspace-creations': true,
    [className]: !!className,
  });

  const source = useMemo(() => {
    return propsValue || [];
  }, [propsValue]);

  const onCreate = useEventCallback((current) => {
    const value = source.concat(current);

    propsOnChange && propsOnChange(value);
  });

  const renderCreations = () => {
    return source.map((item = {}, index) => {
      let onChange;
      let onClickDelete;

      if (propsOnChange) {
        onChange = (current) => {
          const value = source.map((propsItem = {}) => {
            return propsItem === item
              ? { ...item, value: current }
              : propsItem;
          });

          propsOnChange && propsOnChange(value);
        };

        onClickDelete = () => {
          const value = source.slice();

          value.splice(index, 1);
          propsOnChange && propsOnChange(value);
        };
      }

      const renderTools = () => {
        if (!propsOnChange) {
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
    if (!propsOnChange) {
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
