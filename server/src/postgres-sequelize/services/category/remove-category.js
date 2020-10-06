'use strict';

const { Category } = require('../../models');
const findCategoryChildren = require('./find-category-children');
const getCategory = require('./get-category');

module.exports = async function removeCategory(categoryId) {
  const category = await getCategory(categoryId);
  const categoryChildren = await findCategoryChildren(category.name);

  if (categoryChildren.length) {
    throw new Error('Can not remove category with children categories');
  }

  return Category.destroy({ where: { _id: categoryId } });
};
