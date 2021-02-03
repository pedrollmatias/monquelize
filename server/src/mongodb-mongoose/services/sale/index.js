'use strict';

module.exports = {
  query: require('./get-sale'),
  get: require('./get-sales'),
  add: require('./add-sale'),
  edit: require('./edit-sale'),
  remove: require('./remove-sale'),
  removeProduct: require('./remove-product-sale'),
  editProduct: require('./edit-product-sale'),
  removeCategory: require('./remove-category'),
};
