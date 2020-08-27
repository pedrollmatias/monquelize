'use strict';

const { Product } = require('../../models');

module.exports = async function getProducts() {
  return Product.findAll();
};
