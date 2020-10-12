'use strict';

const { History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function addInventoryMovement(productId, movement) {
  const product = await getProduct(productId);
  const history = await History.create(movement);

  // Add product history register
  await product.addHistory(history);

  // Update current product amount
  product.currentAmount = Number(movement.amount);

  await product.save();

  return product;
};
