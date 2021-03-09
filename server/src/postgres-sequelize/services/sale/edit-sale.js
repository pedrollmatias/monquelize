'use strict';

const { Sale, SaleProduct, History } = require('../../models');
const getProduct = require('../product/get-product');

module.exports = async function editSale(saleId, sale) {
  let [, updatedSale] = await Sale.update(sale, {
    where: { _id: saleId },
    returning: true,
    plain: true,
  });

  updatedSale = updatedSale.dataValues;

  for (const product of sale.products) {
    const _product = await getProduct(product.productId);
    const saleProductRelation = await SaleProduct.findOne({
      where: { productId: _product._id, saleId: updatedSale._id },
    });

    const amountDifference = product.amount - saleProductRelation.toJSON().amount;

    if (amountDifference > 0) {
      const history = await History.create({ amount: product.amount, movementType: '100', saleId: updatedSale._id });

      await _product.addHistory(history);

      _product.currentAmount += amountDifference;

      await _product.save();
    } else if (amountDifference < 0) {
      const history = await History.create({ amount: product.amount, movementType: '200', saleId: updatedSale._id });

      await _product.addHistory(history);

      _product.currentAmount -= amountDifference;

      await _product.save();
    }

    saleProductRelation.amount = product.amount;
    saleProductRelation.price = product.price;

    await saleProductRelation.save();
  }

  return updatedSale;
};
