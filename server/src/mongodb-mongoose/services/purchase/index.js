'use strict';

module.exports = {
  query: require('./get-purchase'),
  get: require('./get-purchases'),
  add: require('./add-purchase'),
  edit: require('./edit-purchase'),
  remove: require('./remove-purchase'),
  removeProduct: require('./remove-product-purchase'),
  editProduct: require('./edit-product-purchase'),
  removeCategory: require('./remove-category'),
};
