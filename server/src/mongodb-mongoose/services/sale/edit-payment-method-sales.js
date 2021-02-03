'use strict';

const { saleModel } = require('../../models');

module.exports = async function editPaymentMethodSales(paymentMethodData) {
  const sales = await saleModel.find({ paymentMethodRef: paymentMethodData._id });

  for (const sale of sales) {
    await sale.edit({ paymentMethodRef: paymentMethodData.name });
  }
};
