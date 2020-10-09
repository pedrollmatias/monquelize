'use strict';

const { Product } = require('../../models');

module.exports = function addProduct(product) {
  const _product = { ...product, ...product.inventory };

  return Product.create(_product);
};
