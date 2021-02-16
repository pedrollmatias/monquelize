'use strict';

const { purchaseModel } = require('../../models');
const { incrementInventory: incrementProductInventory } = require('../product');

module.exports = async function addPurchase(purchaseData, session) {
  const _purchaseData = {
    ...purchaseData,
    paymentMethodRef: purchaseData.paymentMethod.paymentMethodRef,
    paymentMethodName: purchaseData.paymentMethod.name,
  };
  const purchaseDoc = await purchaseModel.add(_purchaseData, session);

  await purchaseDoc.populate([{ path: 'seller' }]).execPopulate();

  for (const product of purchaseDoc.products) {
    await incrementProductInventory(product.productRef, product.amount, session);
  }
};
