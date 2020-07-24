'use strict';

const paymentMethodModel = require('../../models/payment-method.model');

module.exports = function addPaymentMethod(data) {
  return paymentMethodModel.add(data);
};
