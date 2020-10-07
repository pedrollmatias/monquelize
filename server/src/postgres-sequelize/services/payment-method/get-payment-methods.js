'use strict';

const { PaymentMethod } = require('../../models');

module.exports = async function getPaymentMethod() {
  return PaymentMethod.findAll();
};
