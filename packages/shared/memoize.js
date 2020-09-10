class MemoMap {
  count = 0;

  map = new Map();

  set = (key) => {
    this.map.set(key, this.count);
    this.count += 1;
  };

  get = (key) => {
    let value = this.map.get(key);

    if (value === undefined) {
      this.set(key);
      value = this.get(key);
    }

    return value;
  };

  clear = () => {
    this.map.clear();
  };
}

const dependencies = new MemoMap();
const values = new Map();

const getKey = (...args) => {
  return args
    .map(dependencies.get)
    .join('-');
};

export { MemoMap };

export default (fn) => (...args) => {
  const key = getKey(fn, ...args);
  const had = values.has(key);

  let value = values.get(key);

  if (!had) {
    value = fn && fn(...args);
    values.set(key, value);
  }

  return value;
};
