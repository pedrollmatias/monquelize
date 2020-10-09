'use strict';

const { Product } = require('../../models');

module.exports = function getProducts() {
  return Product.findAll({ where: { removed: false } });
};
