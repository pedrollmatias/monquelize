'use strict';

const { purchaseModel } = require('../../models');
const decrementProductInventory = require('../product/decrement-product-inventory');

module.exports = async function removePurchase(purchaseId, session) {
  const purchaseDoc = await purchaseModel.retrieve(purchaseId, session);

  for (const product of purchaseDoc.products) {
    decrementProductInventory(product._id, product.amount);
  }

  return purchaseDoc.delete();
};
