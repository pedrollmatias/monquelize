'use strict';

const { paymentMethodModel } = require('../../models');

module.exports = function getPaymentMethods(query) {
  query = query || {};

  return paymentMethodModel.find(query);
};
