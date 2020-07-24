'use strict';

const purchaseModel = require('../../models/purchase.model');

module.exports = async function getPurchase(purchaseId) {
  const purchase = await purchaseModel.retrieve(purchaseId);
  const queryPopulate = [{ path: 'buyer' }];

  await purchase.populate(queryPopulate).execPopulate();

  return purchase;
};
