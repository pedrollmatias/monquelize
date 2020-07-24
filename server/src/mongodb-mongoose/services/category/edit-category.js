'use strict';

const { categoryModel } = require('../../models');

module.exports = async function editCategory(categoryId, data) {
  const category = await categoryModel.retrieve(categoryId);
  const oldName = category.name;
  const updatedCategory = await category.edit(unpopulate(data));

  await updatedCategory.updateChildrenPaths(oldName);

  return updatedCategory;
};

function unpopulate(category) {
  category.parent = category.parent ? category.parent._id || category.parent : undefined;

  return category;
}
