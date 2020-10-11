'use strict';

const { purchaseModel, productModel } = require('../../models');

module.exports = async function removePurchase(purchaseId, session) {
  const purchase = await purchaseModel.retrieve(purchaseId);

  // Restore inventory of all products
  for (const product of purchase.products) {
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productHistory = productDoc.history || [];
    const currentAmount = productDoc.currentAmount - product.amount;

    productHistory.push({ date: Date.now(), movementType: '200', amount: product.amount });
    const data = { currentAmount, history: productHistory };

    await productDoc.edit(data);
  }

  return purchase.delete();
};
