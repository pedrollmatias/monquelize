'use strict';

module.exports = {
  add: require('./add-product'),
  decrementInventory: require('./decrement-product-inventory'),
  edit: require('./edit-product'),
  get: require('./get-products'),
  getByCategory: require('./get-products-by-category'),
  incrementInventory: require('./increment-product-inventory'),
  query: require('./get-product'),
  remove: require('./remove-product'),
  count: require('./count-products'),
};
