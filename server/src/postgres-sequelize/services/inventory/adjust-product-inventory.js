'use strict';

const { History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function addInventoryMovement(productId, movement) {
  const product = await getProduct(productId);
  const history = await History.create({ ...movement, movementType: '300' });

  await product.addHistory(history);

  product.currentAmount = Number(movement.amount);

  await product.save();

  return product;
};
