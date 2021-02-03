'use strict';

module.exports = {
  query: require('./get-sale'),
  get: require('./get-sales'),
  add: require('./add-sale'),
  edit: require('./edit-sale'),
  remove: require('./remove-sale'),
  removeProduct: require('./remove-product-sales'),
  editProduct: require('./edit-product-sales'),
  removeCategory: require('./remove-category'),
  editPaymentMethod: require('./edit-payment-method-sales'),
  removePaymentMethod: require('./remove-payment-method-sales'),
  editUnit: require('./edit-unit-sales'),
  removeUnit: require('./remove-unit-sales'),
};
