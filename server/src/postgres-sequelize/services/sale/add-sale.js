'use strict';

const { Sale, History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function addSale(sale) {
  const _sale = await Sale.create(sale);

  for (const product of sale.products) {
    const _product = await getProduct(product.productId);
    const history = await History.create({ amount: product.amount, movementType: '200', saleId: _sale._id });

    await _sale.addProduct(_product, {
      through: { amount: product.amount, price: product.price },
    });

    await _product.addHistory(history);

    _product.currentAmount -= product.amount;
    await _product.save();
  }

  return _sale;
};
