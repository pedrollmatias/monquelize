'use strict';

const { categoryModel } = require('../../models');
const editChildrenPaths = require('./edit-children-categories-paths');
const unpopulate = require('./unpopulate-category');

module.exports = async function editCategory(categoryId, data) {
  const categoryDoc = await categoryModel.retrieve(categoryId);
  const categoryObj = categoryDoc.toObject();
  const updatedCategory = await categoryDoc.edit(unpopulate(data));

  await editChildrenPaths(categoryObj, updatedCategory);

  return updatedCategory;
};
