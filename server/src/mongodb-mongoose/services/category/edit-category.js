'use strict';

const { categoryModel } = require('../../models');
const editChildrenPaths = require('./edit-children-categories-paths');
const unpopulate = require('./unpopulate-category');

module.exports = async function editCategory(categoryId, categoryData, session) {
  const categoryDoc = await categoryModel.retrieve(categoryId, session);
  const categoryObj = categoryDoc.toObject();
  const updatedCategory = await categoryDoc.edit(unpopulate(categoryData));

  await editChildrenPaths(categoryObj, updatedCategory);

  return updatedCategory;
};
