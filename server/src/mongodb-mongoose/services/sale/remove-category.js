'use strict';

const { saleModel } = require('../../models');

module.exports = async function removeCategoryInSales(category) {
  const sales = await saleModel.find({ 'products.category': category._id });

  for (const sale of sales) {
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.category.equals(category._id)) {
        saleProduct.category = undefined;
      }

      return saleProduct;
    });

    await sale.edit({ products: saleProducts });
  }
};
