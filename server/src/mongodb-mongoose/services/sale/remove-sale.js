'use strict';

const { saleModel, productModel } = require('../../models');

module.exports = async function removeSale(saleId, session) {
  const sale = await saleModel.retrieve(saleId);

  // Restore inventory of all products
  for (const product of sale.products) {
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productHistory = productDoc.history || [];
    const currentAmount = productDoc.currentAmount + product.amount;

    productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
    const data = { currentAmount, history: productHistory };

    await productDoc.edit(data);
  }

  return sale.delete();
};
