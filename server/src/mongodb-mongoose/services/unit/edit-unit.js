'use strict';

const { unitModel, saleModel, purchaseModel } = require('../../models');

module.exports = async function editUnit(unitId, data, session) {
  const unit = await unitModel.retrieve(unitId, session);
  const updatedUnit = await unit.edit(data);

  console.log(data);

  // Update product in sales and purchases if unit and shortUnit was modified
  const hasToUpdateInSalesOrPurchases = ['sku', 'name', 'category', 'unit'].some((field) =>
    Object.prototype.hasOwnProperty.call(data, field)
  );

  if (hasToUpdateInSalesOrPurchases) {
    const query = { 'products.unit.unitRef': updatedUnit._id };
    const sales = await saleModel.find(query);
    const purchases = await purchaseModel.find(query);

    for (const sale of sales) {
      const saleProducts = sale.products.map((saleProduct) => {
        if (saleProduct.unit && saleProduct.unit.unitRef.equals(updatedUnit._id)) {
          saleProduct.unit.shortUnit = updatedUnit.shortUnit;
        }

        return saleProduct;
      });

      await sale.edit({ products: saleProducts });
    }

    for (const purchase of purchases) {
      const purchaseProducts = purchase.products.map((purchaseProduct) => {
        if (purchaseProduct.unit && purchaseProduct.unit.unitRef.equals(updatedUnit._id)) {
          purchaseProduct.unit.shortUnit = updatedUnit.shortUnit;
        }

        return purchaseProduct;
      });

      await purchase.edit({ products: purchaseProducts });
    }
  }

  return updatedUnit;
};
