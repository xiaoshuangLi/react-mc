export const insert = (array = [], index, value) => {
  array = array.slice();
  array.splice(index, 0, value);

  return array;
};

export const remove = (array = [], index) => {
  array = array.slice();
  array.splice(index, 1);

  return array;
};

export const push = (array, value) => {
  array = array.slice();
  array.push(value);

  return array;
};

export const isSame = (a = [], b = []) => {
  const { length: aLength } = a;
  const { length: bLength } = b;

  if (aLength !== bLength) {
    return false;
  }

  return a.every(
    (item, index) => b[index] === item,
  );
};
