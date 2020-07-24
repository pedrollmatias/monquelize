'use strict';

module.exports = {
  query: require('./get-payment-method'),
  get: require('./get-payment-methods'),
  add: require('./add-payment-method'),
  edit: require('./edit-payment-method'),
  remove: require('./remove-payment-method'),
};
