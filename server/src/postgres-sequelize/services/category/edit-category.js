'use strict';

const { Category } = require('../../models');
const findCategoryChildren = require('./find-category-children');
const validateCategory = require('./validate-category');

module.exports = async function editCategory(categoryId, category) {
  await validateCategory(category);

  const oldCategory = await Category.findOne({ where: { _id: categoryId }, raw: true });

  let [, updatedCategory] = await Category.update(category, {
    where: { _id: categoryId },
    returning: true,
    plain: true,
  });

  updatedCategory = updatedCategory.dataValues;

  const childrenCategories = await findCategoryChildren(oldCategory.name);

  for (const childCategory of childrenCategories) {
    const childPathArray = childCategory.path.split(' > ');
    const parentPathIndex = childPathArray.findIndex((subPath) => subPath === oldCategory.name);
    const newPath = updatedCategory.path
      .split(' > ')
      .concat(childPathArray.slice(parentPathIndex + 1))
      .join(' > ');

    await Category.update({ path: newPath }, { where: { _id: childCategory._id } });
  }

  return updatedCategory;
};
