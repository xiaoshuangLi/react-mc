import { useMemo } from 'react';

import { getFromEvent } from 'shared/utils';
import { useEventCallback } from 'shared/hooks';

import defaultOptions from './options';

const mergeComponentProps = (prevTemplate = {}) => (componentId, partProps = {}) => {
  const { componentMap: prevComponentMap = {} } = prevTemplate;
  const { [componentId]: prevComponent = {} } = prevComponentMap;
  const { props: prevProps = {} } = prevComponent;

  const nextProps = { ...prevProps, ...partProps };
  const nextComponent = { ...prevComponent, props: nextProps };
  const nextComponentMap = { ...prevComponentMap, [componentId]: nextComponent };

  return { ...prevTemplate, componentMap: nextComponentMap };
};

const useMergedOptions = (props = {}) => {
  const { options = {} } = props;

  const denpendencies = Object.values(options);

  return useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    denpendencies,
  );
};

const useRender = (props = {}) => {
  const options = useMergedOptions(props) || {};

  const {
    render,
    getComponentPropsSchema,
  } = options;

  const {
    setValue: propsSetValue,
  } = props;

  const setValue = useEventCallback((...args) => {
    propsSetValue && propsSetValue(...args);
  });

  return useEventCallback((ComponentClass, component = {}) => (renderProps = {}, ref) => {
    const propsSchema = getComponentPropsSchema(component) || {};
    const { properties = {} } = propsSchema;
    const { id: componentId } = component;

    renderProps = Object.entries(properties).reduce((res = {}, entry = []) => {
      const [key, schema = {}] = entry;
      const { type, params = [] } = schema;

      if (type !== 'func') {
        return res;
      }

      if (!params.length) {
        return res;
      }

      const listener = renderProps[key];
      const runner = (...args) => {
        const partProps = params.reduce((curr = {}, param, index) => {
          curr[param] = getFromEvent(args[index]);
          return curr;
        }, {});

        const changer = (value) => mergeComponentProps(value)(
          componentId,
          partProps,
        );

        setValue && setValue(changer);
        listener && listener(...args);
      };

      return { ...res, [key]: runner };
    }, renderProps);

    return render(ComponentClass, component)(renderProps, ref);
  });
};

export const useOptions = (props = {}) => {
  const options = useMergedOptions(props);
  const render = useRender(props);

  return useMemo(
    () => ({
      ...options,
      render,
    }),
    [options, render],
  );
};
