'use strict';

const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const saleModel = require('../../models/sale.model');
const purchaseModel = require('../../models/purchase.model');

module.exports = async function removeProduct(productId, session) {
  // Get product
  const product = await productModel.retrieve(productId, session);

  // Remove product in category
  if (product.category) {
    const category = await categoryModel.retrieve(product.category, session);

    await category.removeProduct(product._id);
  }

  // Remove product reference in sales and purchases
  const query = { 'products.productRef': product._id };
  const sales = await saleModel.find(query);
  const purchases = await purchaseModel.find(query);

  for (const sale in sales) {
    await sale.removeProduct(product._id);
  }

  for (const purchase in purchases) {
    await purchase.removeProduct(product._id);
  }

  return product.delete();
};
