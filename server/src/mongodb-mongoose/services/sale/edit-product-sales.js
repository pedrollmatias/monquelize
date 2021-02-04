'use strict';

const { saleModel } = require('../../models');

module.exports = async function editProductSales(productId, productPopulated, session) {
  const sales = await saleModel.get({ 'products.productRef': productId }, session);

  for (const sale of sales) {
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.productRef.equals(productId)) {
        saleProduct.sku = productPopulated.sku;
        saleProduct.name = productPopulated.name;
        saleProduct.category = productPopulated.category._id;
        saleProduct.unitRef = productPopulated.unit._id;
        saleProduct.shortUnit = productPopulated.unit.shortUnit;
      }

      return saleProduct;
    });

    return sale.edit({ products: saleProducts });
  }
};
