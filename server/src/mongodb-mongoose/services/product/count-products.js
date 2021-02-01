'use strict';

const { productModel } = require('../../models');

module.exports = function countProducts() {
  return productModel.count();
};
