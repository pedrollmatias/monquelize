'use strict';

const { productModel } = require('../../models');

module.exports = async function addInventoryMovement(productId, movement) {
  const product = await productModel.retrieve(productId);
  const productHistory = product.history || [];

  const currentAmount = Number(movement.amount);

  productHistory.push(movement);
  const data = { currentAmount, history: productHistory };

  await product.edit(data);

  return product;
};
