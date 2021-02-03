'use strict';

module.exports = {
  query: require('./get-purchase'),
  get: require('./get-purchases'),
  add: require('./add-purchase'),
  edit: require('./edit-purchase'),
  remove: require('./remove-purchase'),
  removeProduct: require('./remove-product-purchases'),
  editProduct: require('./edit-product-purchases'),
  removeCategory: require('./remove-category'),
  editPaymentMethod: require('./edit-payment-method-purchases'),
  removePaymentMethod: require('./remove-payment-method-purchases'),
  editUnit: require('./edit-unit-purchases'),
  removeUnit: require('./remove-unit-purchases'),
};
