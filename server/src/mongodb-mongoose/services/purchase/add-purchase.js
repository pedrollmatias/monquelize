'use strict';

const { productModel, purchaseModel } = require('../../models');

module.exports = async function addPurchase(data, session) {
  const purchase = await purchaseModel.add(data, session);
  const queryPopulate = [{ path: 'buyer' }];

  await purchase.populate(queryPopulate).execPopulate();

  for (const product of purchase.products) {
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productHistory = productDoc.history || [];
    const currentAmount = productDoc.currentAmount + product.amount;

    productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
    const data = { currentAmount, history: productHistory };

    await productDoc.edit(data);
  }

  return purchase;
};
