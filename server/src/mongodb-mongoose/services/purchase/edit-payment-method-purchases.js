'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function editPaymentMethodPurchases(paymentMethodData) {
  const purchases = await purchaseModel.find({ paymentMethodRef: paymentMethodData._id });

  for (const purchase of purchases) {
    await purchase.edit({ paymentMethodName: paymentMethodData.name });
  }
};
