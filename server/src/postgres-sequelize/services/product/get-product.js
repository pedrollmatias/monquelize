'use strict';

const { Product } = require('../../models');

module.exports = function getProduct(productId) {
  return Product.findByPk(productId);
};
