'use strict';

const { productModel } = require('../../models');

module.exports = async function getProducts() {
  console.log(await productModel.findAll());

  return productModel.findAll();
};
