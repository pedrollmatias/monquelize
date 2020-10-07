'use strict';

const { PaymentMethod } = require('../../models');

module.exports = async function editPaymentMethod(paymentMethodId, paymentMethod) {
  let [, updatedPaymentMethod] = await PaymentMethod.update(paymentMethod, {
    where: { _id: paymentMethodId },
    returning: true,
    plain: true,
  });

  updatedPaymentMethod = updatedPaymentMethod.dataValues;

  return updatedPaymentMethod;
};
