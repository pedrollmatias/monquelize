'use strict';

const { PaymentMethod } = require('../../models');

module.exports = function removePaymentMethod(paymentMethodId) {
  return PaymentMethod.destroy({ where: { _id: paymentMethodId } });
};
