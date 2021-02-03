'use strict';

const { saleModel } = require('../../models');

module.exports = async function removeProductSale(productId) {
  const sales = await saleModel.find({ 'products.productRef': productId });

  for (const sale of sales) {
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.productRef.equals(productId)) {
        saleProduct.productRef = undefined;
      }

      return saleProduct;
    });

    await sale.edit({ products: saleProducts });
  }
};
