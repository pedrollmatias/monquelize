'use strict';

const { paymentMethodModel } = require('../../models');

module.exports = function getPaymentMethod(paymentMethodId) {
  return paymentMethodModel.retrieve(paymentMethodId);
};
