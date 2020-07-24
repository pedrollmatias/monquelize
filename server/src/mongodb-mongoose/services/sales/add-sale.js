'use strict';

const saleModel = require('../../models/sale.model');
const productModel = require('../../models/product.model');

module.exports = async function addSale(data, session) {
  const sale = await saleModel.add(data, session);
  const queryPopulate = [{ path: 'seller' }];

  await sale.populate(queryPopulate).execPopulate();

  if (sale.status === '300') {
    for (const product of sale.products) {
      const productDoc = await productModel.retrieve(product.productRef, session);
      const productInventory = productDoc.inventory;
      const productHistory = productDoc.history || [];

      productInventory.currentAmount -= product.amount;
      productHistory.push({ date: Date.now(), movementType: '200', amount: product.amount });
      const data = { inventory: productInventory, history: productHistory };

      await productDoc.edit(data);
    }
  }

  return sale;
};
