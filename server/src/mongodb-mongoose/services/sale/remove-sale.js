'use strict';

const { saleModel } = require('../../models');
const { decrementInventory: decrementProductInventory } = require('../product');

module.exports = async function removeSale(saleId) {
  const saleDoc = await saleModel.retrieve(saleId);

  for (const product of saleDoc.products) {
    decrementProductInventory(product._id, product.amount);
  }

  return saleDoc.delete();
};
