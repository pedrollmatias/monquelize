'use strict';

const { categoryModel } = require('../../models');

module.exports = async function updateChildrenPaths(oldCategory, newCategory, session) {
  const children = await getAllChildren(oldCategory, session);

  for (const child of children) {
    const childPathArray = child.path.split(' > ');
    const parentPathIndex = childPathArray.findIndex((subPath) => subPath === oldCategory.name);
    const newPath = newCategory.path
      .split(' > ')
      .concat(childPathArray.slice(parentPathIndex + 1))
      .join(' > ');

    child.path = newPath;

    await child.save();
  }
};

function getAllChildren(oldCategory, session) {
  return categoryModel.get({ path: getPathRegex(oldCategory.name) }, session).sort({ path: 1 });
}

function getPathRegex(name) {
  return new RegExp(`(^|( > ))${name} > `);
}
