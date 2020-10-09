'use strict';

const { Product } = require('../../models');

module.exports = function getProduct(productId) {
  return Product.findOne({ where: { _id: productId } });
};
