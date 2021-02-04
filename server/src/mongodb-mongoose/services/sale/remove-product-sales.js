'use strict';

const { saleModel } = require('../../models');

module.exports = async function removeProductSale(productId, session) {
  const sales = await saleModel.get({ 'products.productRef': productId }, session);

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
