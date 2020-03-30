import traverse from 'json-schema-traverse';

const getSchemas = (rootSchema = {}, opts = {}) => {
  const res = [];

  traverse(rootSchema, opts, (...args) => {
    const schema = args[0] || {};
    const pointer = args[1] || '';
    const parentSchema = args[args.length - 2] || {};
    const key = args[args.length - 1] || '';

    res.push({
      key,
      schema,
      pointer,
      rootSchema,
      parentSchema,
    });
  });

  return res;
};

// eslint-disable-next-line
Object.defineProperties(Object.prototype, {
  __schemas: {
    get() {
      const list = getSchemas(this);

      return list.filter((item = {}) => {
        const { parentSchema = {} } = item;

        return parentSchema === this;
      });
    },
  },
  $$schemas: {
    get() { return getSchemas(this); },
  },
});

// 不要返回空对象，空数组
export const getDefault = (schema = {}) => {
  const {
    type,
    default: defaultValue,
    items = {},
    properties = {},
  } = schema;

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  if (type === 'object') {
    const entries = Object.entries(properties);
    const valueForObject = entries.reduce((res, item = []) => {
      const [key, value] = item;
      const valueForKey = getDefault(value);

      if (valueForKey !== undefined) {
        res = { ...res, [key]: valueForKey };
      }

      return res;
    }, {});

    const keys = Object.keys(valueForObject) || [];

    return keys.length ? valueForObject : undefined;
  }

  if (type === 'array') {
    const valueForItem = getDefault(items);

    return valueForItem === undefined ? undefined : [valueForItem];
  }
};

export const getPropsSchema = (Comp) => {
  if (!Comp) {
    return;
  }

  const { __docgenInfo: { propsSchema } = {} } = Comp;

  return propsSchema;
};
