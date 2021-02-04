'use strict';

const { saleModel } = require('../../models');
const { decrementInventory: decrementProductInventory } = require('../product');

module.exports = async function removeSale(saleId, session) {
  const saleDoc = await saleModel.retrieve(saleId, session);

  for (const product of saleDoc.products) {
    decrementProductInventory(product._id, product.amount, session);
  }

  return saleDoc.delete();
};
