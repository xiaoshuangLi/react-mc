import { findRelationComponentIdsGroup } from 'shared/relation';

export const traverse = (value = {}, fn) => {
  const {
    relationMap = {},
    rootComponentIds = [],
  } = value;

  const loop = (componentIds = []) => {
    componentIds.forEach((componentId) => {
      const relation = relationMap[componentId] || {};
      const componentIdsGroup = findRelationComponentIdsGroup(relation) || [];

      fn && fn(componentId);
      componentIdsGroup.forEach(loop);
    });
  };

  loop(rootComponentIds);
};
