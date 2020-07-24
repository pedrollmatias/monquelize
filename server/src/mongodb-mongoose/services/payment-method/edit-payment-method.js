'use strict';

const paymentMethodModel = require('../../models/payment-method.model');
const saleModel = require('../../models/sale.model');
const purchaseModel = require('../../models/purchase.model');

module.exports = async function editPaymentMethod(paymentMethodId, data, session) {
  const paymentMethod = await paymentMethodModel.retrieve(paymentMethodId, session);
  const updatedPaymentMethod = await paymentMethod.edit(data);

  // Update payment method in sales and purchases if name was modified
  if (Object.prototype.hasOwnProperty.call(data, 'name')) {
    const query = { 'payment.paymentMethodRef': updatedPaymentMethod._id };
    const sales = await saleModel.find(query);
    const purchases = await purchaseModel.find(query);

    for (const sale in sales) {
      const salePayment = sale.payment;

      salePayment.name = updatedPaymentMethod;

      await sale.edit({ payment: salePayment });
    }

    for (const purchase in purchases) {
      const purchasePayment = purchase.payment;

      purchasePayment.name = updatedPaymentMethod;

      await purchase.edit({ payment: purchasePayment });
    }
  }

  return updatedPaymentMethod;
};
