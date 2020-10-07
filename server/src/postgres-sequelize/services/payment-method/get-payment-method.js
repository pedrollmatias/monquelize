'use strict';

const { PaymentMethod } = require('../../models');

module.exports = async function getPaymentMethod(paymentMethodId) {
  return PaymentMethod.findOne({ where: { _id: paymentMethodId } });
};
