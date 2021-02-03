'use strict';

const { paymentMethodModel } = require('../../models');
const { editPaymentMethod: editPaymentMethodSale } = require('../sale');
const { editPaymentMethod: editPaymentMethodPurchase } = require('../purchase');

module.exports = async function editPaymentMethod(paymentMethodId, data, session) {
  const paymentMethodDoc = await paymentMethodModel.retrieve(paymentMethodId, session);
  const updatedPaymentMethodDoc = await paymentMethodDoc.edit(data);

  if (Object.prototype.hasOwnProperty.call(data, 'name')) {
    await editPaymentMethodSale(updatedPaymentMethodDoc);
    await editPaymentMethodPurchase(updatedPaymentMethodDoc);
  }

  return updatedPaymentMethodDoc;
};
