'use strict';

const paymentMethodModel = require('../../models/payment-method.model');
const saleModel = require('../../models/sale.model');
const purchaseModel = require('../../models/purchase.model');

module.exports = async function removePaymentMethod(paymentMethodId, session) {
  const paymentMethod = await paymentMethodModel.retrieve(paymentMethodId, session);

  // Remove payment method ref in sales and purchases
  const query = { 'payment.paymentMethodRef': paymentMethod._id };
  const sales = await saleModel.find(query);
  const purchases = await purchaseModel.find(query);

  for (const sale in sales) {
    const salePayment = sale.payment;

    salePayment.paymentMethodRef = undefined;

    await sale.edit({ payment: salePayment });
  }

  for (const purchase in purchases) {
    const purchasePayment = purchase.payment;

    purchasePayment.paymentMethodRef = undefined;

    await purchase.edit({ payment: purchasePayment });
  }

  return paymentMethod.remove();
};
