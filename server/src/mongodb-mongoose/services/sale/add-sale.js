'use strict';

const { saleModel } = require('../../models');
const decrementInventory = require('../product/decrement-product-inventory');

module.exports = async function addSale(saleData, session) {
  const _saleData = {
    ...saleData,
    paymentMethodRef: saleData.paymentMethod.paymentMethodRef,
    paymentMethodName: saleData.paymentMethod.name,
  };
  const saleDoc = await saleModel.add(_saleData, session);

  await saleDoc.populate([{ path: 'seller' }]).execPopulate();

  for (const product of saleDoc.products) {
    await decrementInventory(product.productRef, product.amount, session);
  }

  return saleDoc;
};
