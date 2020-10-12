'use strict';

const { Purchase, History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function addPurchase(purchase) {
  const _purchase = await Purchase.create(purchase);

  for (const product of purchase.products) {
    const _product = await getProduct(product.productId);
    const history = await History.create({ amount: product.amount, movementType: '200', purchaseId: _purchase._id });

    // Add relation between purchase and products
    await _purchase.addProduct(_product, {
      through: { amount: product.amount, price: product.price },
    });
    // Add product history register
    await _product.addHistory(history);
    // Update current product amount
    _product.currentAmount += product.amount;
    await _product.save();
  }

  return _purchase;
};
