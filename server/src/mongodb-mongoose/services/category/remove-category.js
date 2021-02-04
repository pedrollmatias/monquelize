'use strict';

const { categoryModel } = require('../../models');
const { removeCategory: removeCategoryInSales } = require('../sale');
const { removeCategory: removeCategoryInPurchases } = require('../purchase');

module.exports = async function removeCategory(categoryId, session) {
  const category = await categoryModel.retrieve(categoryId, session);

  await removeCategoryInSales(category, session);
  await removeCategoryInPurchases(category, session);

  return category.delete();
};
