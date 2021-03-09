'use strict';

const { Purchase, PurchaseProduct, History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function removePurchase(purchaseId) {
  const purchaseProduct = await PurchaseProduct.findAll({ where: { purchaseId } });

  for (const product of purchaseProduct) {
    const _product = await getProduct(product.productId);
    const history = await History.create({ amount: product.amount, movementType: '200' });

    await _product.addHistory(history);

    _product.currentAmount -= product.amount;

    await _product.save();
  }

  await PurchaseProduct.destroy({ where: { purchaseId: purchaseId } });

  return Purchase.destroy({ where: { _id: purchaseId } });
};
