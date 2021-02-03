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
};
