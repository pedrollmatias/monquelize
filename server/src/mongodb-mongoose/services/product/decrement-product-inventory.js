'use strict';

const { productModel } = require('../../models');

module.exports = async function decrementProductInventory(productId, amount, session) {
  const productDoc = await productModel.retrieve(productId, session);
  const productHistory = productDoc.history || [];
  const currentAmount = productDoc.currentAmount - amount;

  productHistory.push({ date: Date.now(), movementType: '200', amount });
  const data = { currentAmount, history: productHistory };

  return productDoc.edit(data);
};
