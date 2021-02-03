'use strict';

module.exports = {
  query: require('./get-product'),
  get: require('./get-products'),
  add: require('./add-product'),
  edit: require('./edit-product'),
  remove: require('./remove-product'),
  adjustInventory: require('./adjust-inventory'),
  count: require('./count-products'),
  unpopulate: require('./unpopulate-product'),
  incrementInventory: require('./increment-product-inventory'),
  decrementInventory: require('./decrement-product-inventory'),
};
