'use strict';

const unitModel = require('../../models/unit.model');
const saleModel = require('../../models/sale.model');
const purchaseModel = require('../../models/purchase.model');

module.exports = async function removeUnit(unitId, session) {
  const unit = await unitModel.retrieve(unitId, session);

  // Remove unit reference in sales and purchases
  const query = { 'products.unit.unitRef': unit._id };
  const sales = await saleModel.find(query);
  const purchases = await purchaseModel.find(query);

  for (const sale in sales) {
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.unit && saleProduct.unit.unitRef.equals(unit._id)) {
        saleProduct.unit.unitRef = undefined;
      }

      return saleProduct;
    });

    await sale.edit({ products: saleProducts });
  }

  for (const purchase in purchases) {
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.unit && purchaseProduct.unit.unitRef.equals(unit._id)) {
        purchaseProduct.unit.unitRef = undefined;
      }

      return purchaseProduct;
    });

    await purchase.edit({ products: purchaseProducts });
  }

  await unit.remove();
};
