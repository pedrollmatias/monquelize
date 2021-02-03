'use strict';

const { paymentMethodModel } = require('../../models');
const { removePaymentMethod: removePaymentMethodSales } = require('../sale');
const { removePaymentMethod: removePaymentMethodPurchases } = require('../purchase');

module.exports = async function removePaymentMethod(paymentMethodId, session) {
  const paymentMethod = await paymentMethodModel.retrieve(paymentMethodId, session);

  await removePaymentMethodSales(paymentMethod);
  await removePaymentMethodPurchases(paymentMethod);

  return paymentMethod.delete();
};
