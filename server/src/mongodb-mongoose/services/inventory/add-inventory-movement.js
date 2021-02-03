'use strict';

const { productModel } = require('../../models');
const {
  decrementInventory: decrementProductInventory,
  incrementInventory: incrementProductInventory,
} = require('../product');

module.exports = async function addInventoryMovement(productId, movement) {
  const productDoc = await productModel.retrieve(productId);

  if (movement.movementType === '100') {
    const product = await incrementProductInventory(productDoc._id, movement.amount);

    return product;
  }

  if (movement.movementType === '200') {
    const product = await decrementProductInventory(productDoc._id, movement.amount);

    return product;
  }

  throw new Error('Movement type not suported');
};
