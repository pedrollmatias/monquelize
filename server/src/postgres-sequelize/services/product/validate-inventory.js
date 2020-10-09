'use strict';

module.exports = function validateInventory(product) {
  const currentAmount = product.inventory && product.inventory.currentAmount;
  const minAmount = product.inventory && product.inventory.minAmount;
  const maxAmount = product.inventory && product.inventory.maxAmount;

  if (currentAmount < 0) {
    throw new Error('Quantity in inventory unavaliable');
  } else if (minAmount && currentAmount < minAmount) {
    throw new Error('A product can not have an amount less than the minimum allowed');
  }

  if (maxAmount && currentAmount > maxAmount) {
    throw new Error('A product can not have an amount greater than the maximum allowed');
  }

  if (minAmount && maxAmount && minAmount > maxAmount) {
    throw new Error('Minimum amount can not be greater than maximum amount');
  }
};
