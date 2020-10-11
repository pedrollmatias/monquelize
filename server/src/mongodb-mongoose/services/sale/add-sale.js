'use strict';

const { productModel, saleModel } = require('../../models');

module.exports = async function addSale(data, session) {
  const sale = await saleModel.add(data, session);
  const queryPopulate = [{ path: 'seller' }];

  await sale.populate(queryPopulate).execPopulate();

  for (const product of sale.products) {
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productHistory = productDoc.history || [];
    const currentAmount = productDoc.currentAmount - product.amount;

    productHistory.push({ date: Date.now(), movementType: '200', amount: product.amount });
    const data = { currentAmount, history: productHistory };

    await productDoc.edit(data);
  }

  return sale;
};
