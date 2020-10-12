'use strict';

const getProducts = require('../product/get-products');

module.exports = function getInventory(query) {
  return getProducts(query);
};
