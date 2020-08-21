'use strict';

const { productModel } = require('../../models');

module.exports = async function getProducts() {
  return productModel.findAll();
};
