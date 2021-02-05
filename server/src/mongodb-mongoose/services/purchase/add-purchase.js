'use strict';

const { purchaseModel } = require('../../models');
const { incrementInventory: incrementProductInventory } = require('../product');

module.exports = async function addPurchase(purchaseData, session) {
  const purchaseDoc = await purchaseModel.add(purchaseData, session);

  await purchaseDoc.populate([{ path: 'buyer' }]).execPopulate();

  for (const product of purchaseDoc.products) {
    await incrementProductInventory(product._id, product.amount, session);
  }

  return purchaseDoc;
};
