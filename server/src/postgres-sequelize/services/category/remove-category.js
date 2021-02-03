'use strict';

const { Category } = require('../../models');
const getChildren = require('./get-childen-categories');
const getCategory = require('./get-category');

module.exports = async function removeCategory(categoryId) {
  const category = await getCategory(categoryId);
  const categoryChildren = await getChildren(category.name);

  if (categoryChildren.length) {
    throw new Error('Can not remove category with children categories');
  }

  return Category.update({ removed: true }, { where: { _id: categoryId } });
};
