'use strict';

const { categoryModel } = require('../../models');
const removeCategoryInSales = require('../sale/remove-category');
const removeCategoryInPurchases = require('../purchase/remove-category');

module.exports = async function removeCategory(categoryId, session) {
  const category = await categoryModel.retrieve(categoryId, session);

  await removeCategoryInSales(category, session);
  await removeCategoryInPurchases(category, session);

  return category.delete();
};
