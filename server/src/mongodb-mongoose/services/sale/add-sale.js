'use strict';

const { saleModel } = require('../../models');
const { decrementInventory: decrementProductInventory } = require('../product');

module.exports = async function addSale(data, session) {
  const saleDoc = await saleModel.add(data, session);

  await saleDoc.populate([{ path: 'seller' }]).execPopulate();

  for (const product of saleDoc.products) {
    await decrementProductInventory(product.productRef, product.amount);
  }

  return saleDoc;
};
