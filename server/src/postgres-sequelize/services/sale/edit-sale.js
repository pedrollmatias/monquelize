'use strict';

const { Sale, SaleProduct } = require('../../models');
const getProduct = require('../product/get-product');
const incrementProductInventory = require('../product/increment-product-inventory');
const decremenetProductInventory = require('../product/decremenet-product-inventory');

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
      await incrementProductInventory(_product, updatedSale._id, product.amount, amountDifference);
    } else if (amountDifference < 0) {
      await decremenetProductInventory(_product, updatedSale._id, product.amount, amountDifference);
    }

    saleProductRelation.amount = product.amount;
    saleProductRelation.price = product.price;

    await saleProductRelation.save();
  }

  return updatedSale;
};
