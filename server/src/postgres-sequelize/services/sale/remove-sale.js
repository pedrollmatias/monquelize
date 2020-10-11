'use strict';

const { Sale, SaleProduct, History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function removeSale(saleId) {
  const saleProduct = await SaleProduct.findAll({ where: { saleId } });

  for (const product of saleProduct) {
    const _product = await getProduct(product.productId);
    const history = await History.create({ amount: product.amount, movementType: '100' });

    // Add product history register
    await _product.addHistory(history);
    // Update current product amount
    _product.currentAmount += product.amount;
    await _product.save();
  }

  // Remove relation sale_product
  await SaleProduct.destroy({ where: { saleId: saleId } });

  return Sale.destroy({ where: { _id: saleId } });
};
