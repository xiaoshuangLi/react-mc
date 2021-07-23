import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  useImperativeHandle,
  isValidElement,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getFromEvent } from 'shared/utils';
import { useEventCallback } from 'shared/hooks';

import { CollectionsContext, CallbacksContext, withExtraction } from './utils/hooks';

import Creation from './Creation';

const { Provider: CallbacksProvider } = CallbacksContext;

const propToKeywords = (prop = {}) => {
  const valid = isValidElement(prop);

  const type = typeof prop;

  switch (type) {
    case 'object': {
      if (!prop) {
        return [];
      }

      if (valid) {
        return propToKeywords(prop.props);
      }

      const values = Object.values(prop);

      return values.reduce((res = '', value) => {
        const more = propToKeywords(value);
        return res.concat(more);
      }, []);
    }
    case 'number':
    case 'string':
      return [`${prop}`];
    default:
      return [];
  }
};

const definitionToCreation = (definition = {}) => {
  const { type, value } = definition;

  return value === undefined
    ? { type }
    : { type, value };
};

const useConditions = (props = {}) => {
  const { output, conditions = [] } = props;

  return useMemo(() => {
    return output
      ? [{ output }, ...conditions]
      : conditions;
  }, [output, conditions]);
};

const useCollections = (props) => {
  const conditions = useConditions(props);
  const [collections = []] = useContext(CollectionsContext);

  const judge = useCallback((definition = {}) => {
    return conditions.every((condition = {}) => {
      if (typeof condition === 'function') {
        return condition(definition);
      }

      const entries = Object.entries(condition);

      return entries.every((entry = []) => {
        const [key, value] = entry;
        const { [key]: definitionValue } = definition;

        const arraied = Array.isArray(value);
        const array = arraied ? value : [value];

        return array.includes(definitionValue);
      });
    });
  }, [conditions]);

  return useMemo(() => {
    if (!collections.length) {
      return [];
    }

    const sort = (collection = {}) => {
      const { root } = collection;

      return root ? -1 : 0;
    };

    const map = (collection = {}) => {
      const { definitions = [] } = collection;

      const nextDefinitions = definitions.filter(judge);
      return { ...collection, definitions: nextDefinitions };
    };

    const filter = (collection = {}) => {
      const { definitions = [] } = collection;

      return !!definitions.length;
    };

    return collections
      .sort(sort)
      .map(map)
      .filter(filter);
  }, [collections, judge]);
};

const useKeyword = (props = {}) => {
  const {
    keyword: propsKeyword,
    onSearch: propsOnSearch,
  } = props;

  const [keyword, setKeyword] = useState(propsKeyword);

  const onChangeKeyword = useEventCallback(() => {
    if (keyword === propsKeyword) {
      return;
    }

    propsOnSearch && propsOnSearch(keyword);
  });

  const onChangePropsKeyword = useEventCallback(() => {
    if (keyword === propsKeyword) {
      return;
    }

    setKeyword(propsKeyword);
  });

  useEffect(onChangeKeyword, [keyword]);
  useEffect(onChangePropsKeyword, [propsKeyword]);

  return [keyword, setKeyword];
};

const SelectorCollection = React.forwardRef((props = {}, ref) => {
  const {
    className,
    collection = {},
    onSelect: propsOnSelect,
    onUpdateStore: propsOnUpdateStore,
    ...others
  } = props;
  const {
    type,
    title,
    definitions = [],
  } = collection;

  const cls = classnames({
    'selector-collection': true,
    [className]: !!className,
  });

  const [store, setStore] = useState([]);

  const appendArgument = useEventCallback((definition = {}, argument = {}) => {
    const { type: definitionType } = definition;
    const { value, options } = argument;

    setStore((prevStore = []) => {
      const argumentCurrent = { value, options };

      const found = prevStore.find(
        (item = {}) => item.type === definitionType,
      );

      if (found) {
        const { arguments: foundArguments = [] } = found;

        const nextArguments = foundArguments.concat(argumentCurrent);
        const nextFound = { ...found, arguments: nextArguments };

        return prevStore.map((item) => {
          return item === found ? nextFound : item;
        });
      }

      const storeCurrent = {
        type: definitionType,
        arguments: [argumentCurrent],
      };

      return prevStore.concat(storeCurrent);
    });
  });

  const appendDecoration = useEventCallback((definition = {}, decoration = {}) => {
    const { type: definitionType } = definition;

    setStore((prevStore = []) => {
      const found = prevStore.find(
        (item = {}) => item.type === definitionType,
      );

      const keywordsCurrent = propToKeywords(decoration) || [];

      if (found) {
        const { keywords: foundKeywords = [] } = found;

        const nextKeywords = foundKeywords.concat(keywordsCurrent);
        const nextFound = { ...found, keywords: nextKeywords };

        return prevStore.map((item) => {
          return item === found ? nextFound : item;
        });
      }

      const storeCurrent = {
        type: definitionType,
        keywords: [definitionType, keywordsCurrent],
      };

      return prevStore.concat(storeCurrent);
    });
  });

  const renderTitle = () => {
    const text = title || type;

    if (!text) {
      return null;
    }

    return (
      <div className="collection-title">{ text }</div>
    );
  };

  const renderContent = () => {
    const items = definitions.map((definition = {}, index) => {
      const creation = definitionToCreation(definition);

      const callbacksValue = {
        appendArgument: (...args) => appendArgument(definition, ...args),
        appendDecoration: (...args) => appendDecoration(definition, ...args),
      };

      const onClick = () => propsOnSelect && propsOnSelect(creation);

      return (
        <CallbacksProvider value={callbacksValue} key={index}>
          <div className="content-definition" onClick={onClick}>
            <Creation mode="" {...creation} />
          </div>
        </CallbacksProvider>
      );
    });

    return (
      <div className="collection-content">
        { items }
      </div>
    );
  };

  useEffect(() => {
    propsOnUpdateStore && propsOnUpdateStore(store);
  }, [store, propsOnUpdateStore]);

  if (!definitions.length) {
    return null;
  }

  return (
    <div ref={ref} className={cls} {...others}>
      { renderTitle() }
      { renderContent() }
    </div>
  );
});

const Selector = React.forwardRef((props = {}, ref) => {
  const {
    className,
    output,
    compact,
    conditions,
    value: propsValue,
    keyword: propsKeyword,
    onClick: propsOnClick,
    onChange: propsOnChange,
    onSearch: propsOnSearch,
    ...others
  } = props;

  const cls = classnames({
    'workspace-selector': true,
    'selector-compact': !!compact,
    [className]: !!className,
  });

  const collections = useCollections(props);
  const [keyword, setKeyword] = useKeyword(props);

  /**
   * [{
   *    type,
   *    keywords = [''],
   *    arguments = [{ value, label }],
   * }] = store.current;
   */
  const [store, setStore] = useState([]);

  const searchedCollections = useMemo(() => {
    let resultCollections = collections;

    if (keyword) {
      resultCollections = resultCollections.map((collection = {}) => {
        const { definitions = [] } = collection;

        const nextDefinitions = definitions.filter((definition = {}) => {
          const { type } = definition;

          const found = store.find(
            (item = {}) => item.type === type,
          ) || {};

          const { keywords = [] } = found;

          return keywords.some(
            (current = '') => current.includes(keyword),
          );
        });

        return { ...collection, definitions: nextDefinitions };
      });
    }

    const reg = /^[a-z]$/;
    const useless = reg.test(keyword);
    const useful = keyword && !useless;

    if (useful) {
      const matchedDefinitions = collections.reduce((res = [], collection = {}) => {
        const { definitions = [] } = collection;

        return definitions.reduce((more = [], definition = {}) => {
          const { type } = definition;

          const included = more.some(
            (item = {}) => item.type === type,
          );

          if (included) {
            return more;
          }

          const found = store.find(
            (item = {}) => item.type === type,
          ) || {};

          const { arguments: foundArguments = [] } = found;

          const initialValue = foundArguments.map(
            (item = {}) => item.value,
          );

          const macthedValues = [];

          foundArguments.forEach((foundArgument = {}, index) => {
            const { options = [] } = foundArgument;

            options.forEach((option = {}) => {
              const { value } = option;

              const keywords = propToKeywords(option) || [];
              const macthed = keywords.some(
                (current = '') => current.includes(keyword),
              );

              if (!macthed) {
                return;
              }

              const macthedValue = initialValue.slice();

              macthedValue[index] = value;
              macthedValues.push(macthedValue);
            });
          });

          if (!macthedValues.length) {
            return more;
          }

          const moreDefinitions = macthedValues.map((value) => {
            return { type, value };
          });

          return more.concat(moreDefinitions);
        }, res);
      }, []);

      if (matchedDefinitions.length) {
        const matchedCollection = {
          title: keyword,
          definitions: matchedDefinitions,
        };

        resultCollections = [matchedCollection, ...resultCollections];
      }
    }

    return resultCollections;
  }, [collections, keyword, store]);

  const getCollections = useEventCallback(() => {
    return collections;
  });

  const onChange = useEventCallback((...args) => {
    propsOnChange && propsOnChange(...args);
  });

  const onClickKeyword = useEventCallback(() => {
    onChange(keyword);
  });

  const onChangeKeyword = useEventCallback((e = {}) => {
    const nextKeyword = getFromEvent(e);

    e.stopPropagation();
    setKeyword(nextKeyword);
  });

  const onKeyDownKeyword = useEventCallback((e = {}) => {
    const { which } = e;

    if (which !== 13) {
      return;
    }

    if (output) {
      keyword && onChange(keyword);
    } else {
      const foundCollection = searchedCollections.find((collection = {}) => {
        const { definitions = [] } = collection;

        return !!definitions.length;
      }) || {};

      const { definitions = [] } = foundCollection;
      const [definition] = definitions;

      if (definition) {
        const creation = definitionToCreation(definition);

        onChange(creation);
      }
    }
  });

  const onUpdateStore = useEventCallback((more = []) => {
    setStore((prevStore = []) => {
      const types = more.map(
        (item = {}) => item.type,
      );

      const list = prevStore.filter((item = {}) => {
        const included = types.includes(item.type);
        return !included;
      });

      return list.concat(more);
    });
  });

  const renderInput = () => {
    return (
      <input
        autoFocus
        type="text"
        className="input"
        placeholder="搜索"
        value={keyword}
        onChange={onChangeKeyword}
        onKeyDown={onKeyDownKeyword}
      />
    );
  };

  const renderKeyword = () => {
    if (!output) {
      return null;
    }

    if (!keyword) {
      return null;
    }

    return (
      <div className="keyword" onClick={onClickKeyword}>
        { keyword }
      </div>
    );
  };

  const renderAnalysis = () => {
    const items = collections.map((collection = {}, index) => {
      return (
        <SelectorCollection
          key={index}
          collection={collection}
          onUpdateStore={onUpdateStore}
        />
      );
    });

    return (
      <div className="body-analysis">
        { items }
      </div>
    );
  };

  const renderCollections = () => {
    const items = searchedCollections.map((collection = {}, index) => {
      return (
        <SelectorCollection
          className="collections-item"
          key={index}
          collection={collection}
          onSelect={onChange}
        />
      );
    });

    return (
      <div className="body-collections">
        { items }
      </div>
    );
  };

  useImperativeHandle(ref, () => {
    const { current } = ref;

    if (current) {
      current.getCollections = getCollections;
    }

    return current;
  }, [ref, getCollections]);

  return (
    <div ref={ref} className={cls} {...others}>
      <div className="selector-header">
        { renderInput() }
        { renderKeyword() }
      </div>
      <div className="selector-body workspace-decoration-for-minimal">
        { renderAnalysis() }
        { renderCollections() }
      </div>
    </div>
  );
});

Selector.propTypes = {
  conditions: PropTypes.arrayOf(
    PropTypes.object,
  ),
  output: PropTypes.bool,
  compact: PropTypes.bool,
  keyword: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
};

Selector.defaultProps = {
  conditions: [],
  output: false,
  compact: false,
  keyword: '',
  value: undefined,
  onChange: undefined,
  onSearch: undefined,
};

export default withExtraction(Selector);
