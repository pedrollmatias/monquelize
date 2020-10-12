'use strict';

const { productModel } = require('../../models');

module.exports = function getProductInventory(productId) {
  return productModel.findById(productId);
};
