'use strict';

const { paymentMethodModel } = require('../../models');
const { editPaymentMethod: editPaymentMethodSale } = require('../sale');
const { editPaymentMethod: editPaymentMethodPurchase } = require('../purchase');

module.exports = async function editPaymentMethod(paymentMethodId, paymentMethoddata, session) {
  const paymentMethodDoc = await paymentMethodModel.retrieve(paymentMethodId, session);
  const updatedPaymentMethodDoc = await paymentMethodDoc.edit(paymentMethoddata);

  if (Reflect.has(paymentMethoddata, 'name')) {
    await editPaymentMethodSale(updatedPaymentMethodDoc, session);
    await editPaymentMethodPurchase(updatedPaymentMethodDoc, session);
  }

  return updatedPaymentMethodDoc;
};
