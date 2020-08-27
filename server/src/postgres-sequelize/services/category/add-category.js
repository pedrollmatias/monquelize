'use strict';

const { Category } = require('../../models');

module.exports = async function addCategory(category) {
  let path;

  if (category.parent) {
    const parentCategory = await Category.findOne({
      where: { _id: category.parent.associatedIds.postgresSequelizeId },
      attributes: ['_id', 'path'],
    });

    console.log(parentCategory);

    path = `${parentCategory.path} > ${category.name}`;
    category.parent = category.parent.associatedIds.postgresSequelizeId;
  } else {
    path = category.name;
  }

  return Category.create({ ...category, path });
};
