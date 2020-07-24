'use strict';

const purchaseModel = require('../../models/purchase.model');
const productModel = require('../../models/product.model');

module.exports = async function removePurchase(purchaseId, session) {
  const purchase = await purchaseModel.retrieve(purchaseId, session);

  for (const product of purchase.products) {
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productInventory = productDoc.inventory;
    const productHistory = productDoc.history || [];

    productInventory.currentAmount += productDoc.amount;
    productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
    const data = { inventory: productInventory, history: productHistory };

    await productDoc.edit(data);
  }

  return purchase.remove();
};
