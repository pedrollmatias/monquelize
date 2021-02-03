'use strict';

const { saleModel } = require('../../models');

module.exports = async function removeUnitSales(unitDoc) {
  const sales = await saleModel.find({ 'products.unitRef': unitDoc._id });

  for (const sale of sales) {
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.unitRef && saleProduct.unitRef.equals(unitDoc._id)) {
        saleProduct.unitRef = undefined;
      }

      return saleProduct;
    });

    await sale.edit({ products: saleProducts });
  }
};
