'use strict';

const { Category } = require('../../models');

module.exports = async function validateCategory(category) {
  if (/>/.test(category.name)) {
    throw new Error('The category name can not have the character ">"');
  }

  if (category.parent) {
    const parent = await Category.findOne({
      where: { _id: category.parent.associatedIds.postgresSequelizeId },
      attributes: ['_id', 'path'],
      raw: true,
    });

    category.parent = category.parent.associatedIds.postgresSequelizeId;

    if (!parent) {
      throw new Error('Parent category not found');
    }
    if (parent._id === category._id) {
      throw new Error('A category can not be its own subcategory');
    }
    if (isParent(category, parent)) {
      throw new Error('It is not possible to define as a parent category one of its child categories');
    }

    setPath(category, parent);

    return;
  }

  category.parent = null;

  setPath(category);

  return;
};

function getPathRegex(name) {
  return new RegExp(`(^|( > ))${name} > `);
}

function isParent(category1, category2) {
  return getPathRegex(category1.name).test(category2.path);
}

function setPath(category, parent) {
  category.path = parent ? `${parent.path} > ${category.name}` : category.name;
}
