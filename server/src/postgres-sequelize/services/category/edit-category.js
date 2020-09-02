'use strict';

const { Category } = require('../../models');
const { Op } = require('sequelize');

module.exports = async function editCategory(categoryId, data) {
  const oldCategory = await Category.findOne({ where: { _id: categoryId } });
  const updatedCategory = await Category.update(data, { where: { _id: categoryId } });

  // const parentCategory = await Category.findOne({ where: { _id: oldCategory.parent } });
  const childrenCategories = findChildren(data.parent);

  for (const childCategory of childrenCategories) {
    const childPathArray = childCategory.path.split(' > ');
    const parentPathIndex = childPathArray.indexOf((subPath) => subPath === oldCategory.name);
    const newPath = updatedCategory.path.split(' > ').concat(childPathArray.slice(parentPathIndex)).join(' > ');

    await Category.update(newPath, { where: { _id: childCategory } });
  }

  return updatedCategory;
};

function findChildren(name) {
  return Category.findAll({
    where: { path: { [Op.or]: [{ [Op.like]: `% > ${name} > %` }, { [Op.like]: `${name} > %` }] } },
  });
}
