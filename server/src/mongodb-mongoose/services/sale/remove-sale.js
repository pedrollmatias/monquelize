'use strict';

const { saleModel } = require('../../models');
const incrementProductInventory = require('../product/decrement-product-inventory');

module.exports = async function removeSale(saleId, session) {
  const saleDoc = await saleModel.retrieve(saleId, session);

  for (const product of saleDoc.products) {
    incrementProductInventory(product.productRef, product.amount, session);
  }

  return saleDoc.delete();
};
