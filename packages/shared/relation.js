import { getValueByKeys } from 'shared/utils';

export const isComponentIds = (value = []) => {
  if (Array.isArray(value)) {
    return value.length && value.every(
      (item) => typeof item === 'string',
    );
  }

  return false;
};

export const findRelationKeysGroup = (relation = {}, baseKeys = []) => {
  const type = typeof relation;

  let res = [];
  let list = [];

  if (isComponentIds(relation)) {
    res = [baseKeys];
  } else if (type === 'object') {
    if (Array.isArray(relation)) {
      list = relation.map((item, index) => {
        const nextRelation = item;
        const nextBaseKeys = baseKeys.concat(index);

        return findRelationKeysGroup(nextRelation, nextBaseKeys);
      });
    } else {
      list = Object.keys(relation).map((key) => {
        const nextRelation = relation[key];
        const nextBaseKeys = baseKeys.concat(key);

        return findRelationKeysGroup(nextRelation, nextBaseKeys);
      });
    }
  }

  list.forEach((item) => {
    res = res.concat(item);
  });

  return res.filter(
    (item = []) => item && item.length,
  );
};

export const findRelationComponentIdsGroup = (relation = {}) => {
  const keysGroup = findRelationKeysGroup(relation) || [];

  return keysGroup.map(
    (keys = []) => getValueByKeys(relation, keys),
  );
};
