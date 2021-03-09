'use strict';

const { History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function addInventoryMovement(productId, movement) {
  const product = await getProduct(productId);
  const history = await History.create(movement);

  await product.addHistory(history);

  if (movement.movementType === '100') {
    product.currentAmount += Number(movement.amount);

    await product.save();

    return product;
  } else if (movement.movementType === '200') {
    product.currentAmount -= Number(movement.amount);

    await product.save();

    return product;
  }

  return product;
};
