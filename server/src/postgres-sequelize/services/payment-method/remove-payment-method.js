'use strict';

const { PaymentMethod } = require('../../models');

module.exports = function removePaymentMethod(paymentMethodId) {
  return PaymentMethod.update({ removed: true }, { where: { _id: paymentMethodId } });
};
