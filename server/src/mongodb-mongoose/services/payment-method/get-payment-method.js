'use strict';

const paymentMethodModel = require('../../models/payment-method.model');

module.exports = function getPaymentMethod(paymentMethodId) {
  return paymentMethodModel.retrieve(paymentMethodId);
};
