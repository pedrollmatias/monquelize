'use strict';

const { productModel } = require('../../models');
const { removeProduct: removeProductInCategory } = require('../category');

const { removeProduct: removeProductInSales } = require('../sale');
const { removeProduct: removeProductInPurchases } = require('../purchase');

module.exports = async function removeProduct(productId, session) {
  const productDoc = await productModel.retrieve(productId, session);

  await removeProductInCategory(productDoc.category, productDoc._id, session);
  await removeProductInSales(productDoc._id, session);
  await removeProductInPurchases(productDoc._id, session);

  return productDoc.delete();
};
