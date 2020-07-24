'use strict';

const { saleModel, productModel } = require('../../models');

module.exports = async function removeSale(saleId, session) {
  const sale = await saleModel.retrieve(saleId, session);

  for (const product of sale.products) {
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productInventory = productDoc.inventory;
    const productHistory = productDoc.history || [];

    productInventory.currentAmount += productDoc.amount;
    productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
    const data = { inventory: productInventory, history: productHistory };

    await productDoc.edit(data);
  }

  return sale.delete();
};