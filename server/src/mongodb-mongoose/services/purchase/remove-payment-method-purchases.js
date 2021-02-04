'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function removePaymentMethodPurchases(paymentMethodData, session) {
  const purchases = await purchaseModel.get({ paymentMethodRef: paymentMethodData._id }, session);

  for (const purchase of purchases) {
    await purchase.edit({ paymentMethodName: undefined });
  }
};
