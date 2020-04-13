import { v4 as uuidv4 } from 'uuid';

import { getValueByKeys, setValueByKeys } from 'shared/utils';
import { insert, remove, push, isSame } from 'shared/array';
import {
  findRelationKeysGroup,
  findRelationComponentIdsGroup,
} from 'shared/relation';

import defaultOptions from './options';

let copiedTemplate;
let copiedComponent;

const cloneComponent = (component = {}) => ({
  ...component,
  id: uuidv4(),
});

const mergeComponent = (template = {}) => (component = {}) => {
  const { componentMap = {} } = template;
  const { id: componentId } = component;

  return {
    ...template,
    componentMap: {
      ...componentMap,
      [componentId]: component,
    },
  };
};

const mergeRelation = (template = {}) => (componentId, relation = {}) => {
  const { relationMap = {} } = template;

  return {
    ...template,
    relationMap: {
      ...relationMap,
      [componentId]: relation,
    },
  };
};

function Core(options) {
  const run = (key) => (...args) => {
    const obj = { ...defaultOptions, ...options };
    const fn = obj[key];

    return fn ? fn(...args) : undefined;
  };

  const isRoot = run('isRoot');
  const getComponentChildrenKeys = run('getComponentChildrenKeys');

  const reset = (newOptions = {}) => {
    options = newOptions;
  };

  const isContainer = (component = {}) => {
    const childrenKeys = getComponentChildrenKeys(component) || [];

    return !!childrenKeys.length;
  };

  const getRootComponent = (template = {}) => {
    const { rootComponentIds = [], componentMap = {} } = template;
    const [rootComponentId] = rootComponentIds;

    for (let v = 0; v < rootComponentIds.length; v += 1) {
      const rootComponnet = componentMap[rootComponentId];

      if (isRoot(rootComponnet)) {
        return rootComponnet;
      }
    }
  };

  const getRelation = (template = {}) => (component = {}) => {
    const { id } = component;
    const { relationMap = {} } = template;

    return relationMap[id];
  };

  const getRelationComponentIds = (template = {}) => (component = {}, relationKeys) => {
    const relation = getRelation(template)(component) || {};

    return getValueByKeys(relation, relationKeys);
  };

  let cache = {
    template: {},
    result: {},
  };

  const getCacheResult = (template = {}) => {
    const keys = ['relationMap', 'rootComponentIds'];
    const { template: cacheTemplate = {}, result: cacheResult = {} } = cache;
    const { relationMap = {} } = template;

    const similar = keys.every((key) => {
      return cacheTemplate[key] === template[key];
    });

    if (similar) {
      return cacheResult;
    }

    const result = Object.entries(relationMap).reduce((res = [], item = []) => {
      const [parentId, relation = {}] = item;
      const componentIdsGroup = findRelationComponentIdsGroup(relation);

      componentIdsGroup.forEach((componentIds = []) => {
        componentIds.forEach((componentId) => {
          res[componentId] = parentId;
        });
      });

      return res;
    }, {});

    cache = { template, result };

    return result;
  };

  const findParent = (template = {}) => (component = {}) => {
    const { relationMap = {}, componentMap = {}, rootComponentIds = [] } = template;
    const { id } = component;

    if (!id) {
      return;
    }

    if (rootComponentIds.includes(id)) {
      return;
    }

    const cacheResult = getCacheResult(template) || {};
    const cacheParentId = cacheResult[id];

    if (cacheParentId !== undefined) {
      return componentMap[cacheParentId];
    }

    const parentId = Object.entries(relationMap).find((item = []) => {
      const [relation = {}] = item;
      const componentIdsGroup = findRelationComponentIdsGroup(relation);

      return componentIdsGroup.some(
        (componentIds = []) => componentIds.includes(id),
      );
    });

    return componentMap[parentId];
  };

  const findBastard = (template = {}) => (component) => {
    const { id } = component;
    const { relationMap = {}, componentMap = {} } = template;
    const relation = relationMap[id] || {};

    const { children = [] } = relation;
    const [first] = children;

    return componentMap[first];
  };

  const findBelongRelationKeys = (template = {}) => (component = {}) => {
    const { id: componentId } = component;
    const parent = findParent(template)(component);
    const relation = getRelation(template)(parent);

    if (!relation) {
      return;
    }

    const relationKeysGroup = findRelationKeysGroup(relation) || [];

    return relationKeysGroup.find((keys = []) => {
      const componentIds = getValueByKeys(relation, keys) || [];

      return componentIds.includes(componentId);
    });
  };

  const findBelongRelationComponentIds = (template = {}) => (component = {}) => {
    const parent = findParent(template)(component);
    const relation = getRelation(template)(parent);
    const relationKeys = findBelongRelationKeys(template)(component);

    if (!relation) {
      return;
    }

    return getValueByKeys(relation, relationKeys);
  };

  const fintBelongComponentIds = (template = {}) => (component = {}) => {
    const { id: componentId } = component;
    const { rootComponentIds = [] } = template;

    return rootComponentIds.includes(componentId)
      ? rootComponentIds
      : findBelongRelationComponentIds(template)(component);
  };

  const findRelatedParentIds = (template = {}) => (component = {}) => {
    const parent = findParent(template)(component) || {};
    const { id: parentId } = parent;

    const relationKeys = findBelongRelationKeys(template)(component) || [];
    const parentChildrenKeys = getComponentChildrenKeys(parent) || [];

    if (parentId) {
      const res = findRelatedParentIds(template)(parent) || [];
      const same = isSame(relationKeys, parentChildrenKeys);

      return same ? res : res.concat(parentId);
    }

    return [];
  };

  const findPrevComponent = (template = {}) => (component) => {
    const { componentMap = {} } = template;
    const { id: componentId } = component;

    const componentIds = fintBelongComponentIds(template)(component) || [];
    const index = componentIds.indexOf(componentId);
    const targetId = componentIds[index - 1] || componentIds[componentIds.length - 1];

    return componentMap[targetId];
  };

  const findNextComponent = (template = {}) => (component) => {
    const { componentMap = {} } = template;
    const { id: componentId } = component;

    const componentIds = fintBelongComponentIds(template)(component) || [];
    const index = componentIds.indexOf(componentId);

    const targetId = componentIds[index + 1] || componentIds[0];

    return componentMap[targetId];
  };

  const findClosestComponent = (template = {}) => (component) => {
    const { id: componentId } = component;

    const prevComponent = findPrevComponent(template)(component);
    const nextComponent = findNextComponent(template)(component);
    const parent = findParent(template)(component);

    if (nextComponent && nextComponent.id !== componentId) {
      return nextComponent;
    }

    if (prevComponent && prevComponent.id !== componentId) {
      return nextComponent;
    }

    return parent;
  };

  const isInChildren = (template = {}) => {
    const { componentMap = {} } = template;

    const fn = (parent = {}, child = {}, parentRelationKeys = []) => {
      const { id: parentId } = parent;
      const { id: childId } = child;

      if (!parentId) {
        return !!componentMap[childId];
      }

      const belongRelationKeys = findBelongRelationKeys(template)(child) || [];
      const target = findParent(template)(child) || {};
      const { id: targetId } = target;

      if (parentId === targetId) {
        if (!parentRelationKeys.length) {
          return true;
        }

        return isSame(belongRelationKeys, parentRelationKeys);
      }

      return targetId ? fn(parent, target, parentRelationKeys) : false;
    };

    return fn;
  };

  const appendComponent = (template = {}) => (targetInfo = {}, component = {}) => {
    component = component.id
      ? component
      : { id: uuidv4(), ...component };

    const { relationMap = {}, componentMap = {}, rootComponentIds = [] } = template;
    const {
      offset,
      parentData = getRootComponent(template) || {},
      parentRelationKeys = getComponentChildrenKeys(parentData) || [],
      data: targetComponent = {},
    } = targetInfo;

    const { id: targetId } = targetComponent;
    const { id: parentId } = parentData;
    const { id: componentId } = component;

    if (isRoot(component)) {
      return template;
    }

    if (isRoot(targetComponent)) {
      const relationKeys = getComponentChildrenKeys(targetComponent, template);
      const relationComponentIds = getRelationComponentIds(template)(targetComponent, relationKeys);
      const [firstComponentId] = relationComponentIds;

      if (offset === 0 && firstComponentId) {
        return appendComponent(template)(
          {
            offset,
            data: componentMap[firstComponentId],
          },
          component,
        );
      }

      return appendComponent(template)(
        { parentData: targetComponent },
        component,
      );
    }

    const newComponent = componentMap[componentId] ? cloneComponent(component) : component;
    const { id: newComponentId } = newComponent;

    const targetParent = findParent(template)(targetComponent) || {};
    let { id: targetParentId } = targetParent;

    let newTemplate = mergeComponent(template)(newComponent);

    if (targetParentId && targetParentId !== newComponentId) {
      const relation = relationMap[targetParentId] || {};
      const relationKeys = findBelongRelationKeys(template)(targetComponent, template);
      const relationComponentIds = findBelongRelationComponentIds(template)(targetComponent, template) || [];

      const index = Math.max(relationComponentIds.indexOf(targetId), 0) + offset;
      const newRelationComponentIds = insert(relationComponentIds, index, newComponentId);
      const newRelation = setValueByKeys(relation, relationKeys, newRelationComponentIds);

      newTemplate = mergeRelation(newTemplate)(targetParentId, newRelation);
    } else if (parentId && parentId !== newComponentId) {
      targetParentId = parentId;

      const relation = relationMap[targetParentId] || {};
      const relationComponentIds = getValueByKeys(relation, parentRelationKeys) || [];

      const newRelationComponentIds = push(relationComponentIds, newComponentId);
      const newRelation = setValueByKeys(relation, parentRelationKeys, newRelationComponentIds);

      newTemplate = mergeRelation(newTemplate)(targetParentId, newRelation);
    } else if (!rootComponentIds.includes(newComponentId)) {
      let index;

      if (targetId) {
        index = Math.max(rootComponentIds.indexOf(targetId), 0) + offset;
      } else {
        index = Math.max(rootComponentIds.length, 0);
      }

      const newRootComponentIds = insert(rootComponentIds, index, newComponentId);

      newTemplate = {
        ...newTemplate,
        rootComponentIds: newRootComponentIds,
      };
    }

    if (copiedTemplate) {
      const {
        relationMap: copiedRelationMap = {},
        componentMap: copiedComponentMap = {},
      } = copiedTemplate;

      const copiedRelation = copiedRelationMap[componentId] || {};
      const keysGroup = findRelationKeysGroup(copiedRelation);

      newTemplate = keysGroup.reduce((res, keys) => {
        const copiedComponentIds = getValueByKeys(copiedRelation, keys) || [];
        const nextTargetInfo = { parentData: newComponent, parentRelationKeys: keys };

        return copiedComponentIds.reduce(
          (curr, copiedComponentId) => appendComponent(curr)(nextTargetInfo, copiedComponentMap[copiedComponentId]),
          res,
        );
      }, newTemplate);
    }

    return newTemplate;
  };

  const appendRelation = (template = {}) => (targetInfo = {}, partRelation = {}) => {
    copiedTemplate = template;

    const { componentMap = {} } = template;
    const { data = {}, relationKeys = [] } = targetInfo;

    const partKeysGroup = findRelationKeysGroup(partRelation) || [];

    return partKeysGroup.reduce((res = {}, partKeys = []) => {
      const componentIds = getValueByKeys(partRelation, partKeys);
      const parentRelationKeys = relationKeys.concat(partKeys);
      const currTargetInfo = { parentData: data, parentRelationKeys };

      return componentIds.reduce((curr = {}, currComponentId) => {
        const currComponent = componentMap[currComponentId] || {};

        return appendComponent(curr)(currTargetInfo, currComponent);
      }, res);
    }, template);
  };

  const removeComponent = (template = {}) => (component = {}) => {
    const { componentMap = {} } = template;
    const { id } = component;

    if (isRoot(component)) {
      return template;
    }

    const parent = findParent(template)(component) || {};
    const { id: parentId } = parent;

    const relation = getRelation(template)(component);
    const componentIdsGroups = findRelationComponentIdsGroup(relation) || [];

    let newTemplate = componentIdsGroups.reduce((res, componentIds = []) => {
      return componentIds.reduce(
        (curr, componentId) => removeComponent(curr)(componentMap[componentId]),
        res,
      );
    }, template);

    if (parentId) {
      const relationKeys = findBelongRelationKeys(newTemplate)(component);
      const relationComponentIds = findBelongRelationComponentIds(newTemplate)(component) || [];
      const index = relationComponentIds.indexOf(id);

      if (index > -1) {
        const parentRelation = getRelation(newTemplate)(parent);
        const newRelationComponentIds = remove(relationComponentIds, index);
        const newRealtion = setValueByKeys(parentRelation, relationKeys, newRelationComponentIds);

        newTemplate = mergeRelation(newTemplate)(parentId, newRealtion);
      }
    }

    const {
      rootComponentIds = [],
      componentMap: { [id]: a, ...newComponentMap } = {},
      relationMap: { [id]: b, ...newRelationMap } = {},
    } = newTemplate;

    const newRootComponentIds = rootComponentIds.filter(
      (rootComponentId) => rootComponentId !== id,
    );

    return {
      ...newTemplate,
      rootComponentIds: newRootComponentIds,
      componentMap: newComponentMap,
      relationMap: newRelationMap,
    };
  };

  const copyComponent = (template = {}) => (component = {}) => {
    copiedTemplate = template;
    copiedComponent = component;
  };

  const pasteComponent = (template = {}) => (component = {}) => {
    const { id } = component;

    if (!copiedComponent) {
      return template;
    }

    if (!id) {
      return template;
    }

    let targetInfo;

    if (isContainer(component) && component !== copiedComponent) {
      targetInfo = { parentData: component };
    } else {
      targetInfo = { data: component, offset: 1 };
    }

    return appendComponent(template)(targetInfo, copiedComponent);
  };

  const cutComponent = (template = {}) => (component = {}) => {
    copyComponent(template)(component);

    return removeComponent(template)(component);
  };

  this.reset = reset;
  this.getRootComponent = getRootComponent;
  this.getRelation = getRelation;
  this.getRelationComponentIds = getRelationComponentIds;
  this.findParent = findParent;
  this.findBastard = findBastard;
  this.findBelongRelationKeys = findBelongRelationKeys;
  this.findBelongRelationComponentIds = findBelongRelationComponentIds;
  this.fintBelongComponentIds = fintBelongComponentIds;
  this.findRelatedParentIds = findRelatedParentIds;
  this.findPrevComponent = findPrevComponent;
  this.findNextComponent = findNextComponent;
  this.findClosestComponent = findClosestComponent;
  this.isContainer = isContainer;
  this.isInChildren = isInChildren;
  this.appendComponent = appendComponent;
  this.appendRelation = appendRelation;
  this.removeComponent = removeComponent;
  this.copyComponent = copyComponent;
  this.pasteComponent = pasteComponent;
  this.cutComponent = cutComponent;
}

export default Core;
