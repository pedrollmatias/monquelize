'use strict';

const { categoryModel } = require('../../models');
const editChildrenPaths = require('./edit-children-categories-paths');
const unpopulate = require('./unpopulate-category');

module.exports = async function editCategory(categoryId, data) {
  const category = await categoryModel.retrieve(categoryId);
  const updatedCategory = await category.edit(unpopulate(data));

  await editChildrenPaths(category, updatedCategory);

  return updatedCategory;
};
