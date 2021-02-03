'use strict';

const { productModel } = require('../../models');
const { removeProduct: removeProductInCategory } = require('../category');

const { removeProduct: removeProductInSales } = require('../sale');
const { removeProduct: removeProductInPurchases } = require('../purchase');

module.exports = async function removeProduct(productId, session) {
  const product = await productModel.retrieve(productId, session);

  await removeProductInCategory(product.category, product._id);
  await removeProductInSales(product._id);
  await removeProductInPurchases(product._id);

  return product.delete();
};
