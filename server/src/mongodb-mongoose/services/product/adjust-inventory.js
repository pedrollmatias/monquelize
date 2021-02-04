'use strict';

const { productModel } = require('../../models');

module.exports = async function adjustInventory(productId, data, session) {
  const product = await productModel.retrieve(productId, session);
  let productHistory = product.history || [];
  const productInventory = product.inventory || {};

  productHistory = [...productHistory, { ...data, date: Date.now() }];

  switch (data.movementType) {
    case '100':
      productInventory.currentAmount += Number(data.amount);
      break;
    case '200':
      productInventory.currentAmount -= Number(data.amount);
      break;
  }

  return product.edit({ inventory: productInventory, history: productHistory });
};
