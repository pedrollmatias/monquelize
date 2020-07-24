'use strict';

const { paymentMethodModel } = require('../../models');

module.exports = function addPaymentMethod(data) {
  return paymentMethodModel.add(data);
};
