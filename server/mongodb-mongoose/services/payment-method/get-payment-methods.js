'use strict';

const paymentMethodModel = require('../../models/payment-method.model');

module.exports = function getPaymentMethods(query) {
  query = query || {};

  return paymentMethodModel.find(query);
};
