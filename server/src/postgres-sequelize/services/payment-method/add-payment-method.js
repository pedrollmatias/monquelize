'use strict';

const { PaymentMethod } = require('../../models');

module.exports = function addPaymentMethod(paymentMethod) {
  return PaymentMethod.create(paymentMethod);
};
