'use strict';

const { purchaseModel } = require('../../models');
const { incrementInventory: incrementProductInventory } = require('../product');

module.exports = async function addPurchase(data, session) {
  const purchaseDoc = await purchaseModel.add(data, session);

  await purchaseDoc.populate([{ path: 'buyer' }]).execPopulate();

  for (const product of purchaseDoc.products) {
    incrementProductInventory(product._id, product.amount);
  }

  return purchaseDoc;
};
