'use strict';

const { Sale, SaleProduct, History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function removeSale(saleId) {
  const saleProduct = await SaleProduct.findAll({ where: { saleId } });

  for (const product of saleProduct) {
    const _product = await getProduct(product.productId);
    const history = await History.create({ amount: product.amount, movementType: '100' });

    await _product.addHistory(history);

    _product.currentAmount += product.amount;
    await _product.save();
  }

  await SaleProduct.destroy({ where: { saleId: saleId } });

  return Sale.destroy({ where: { _id: saleId } });
};
