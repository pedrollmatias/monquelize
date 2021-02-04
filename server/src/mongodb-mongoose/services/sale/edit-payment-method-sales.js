'use strict';

const { saleModel } = require('../../models');

module.exports = async function editPaymentMethodSales(paymentMethodData, session) {
  const sales = await saleModel.get({ paymentMethodRef: paymentMethodData._id }, session);

  for (const sale of sales) {
    await sale.edit({ paymentMethodRef: paymentMethodData.name });
  }
};
