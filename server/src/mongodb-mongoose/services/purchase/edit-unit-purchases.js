'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function editUnitPurchases(unitDoc) {
  const purchases = await purchaseModel.find({ 'products.unitRef': unitDoc._id });

  for (const purchase of purchases) {
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.unitRef && purchaseProduct.unitRef.equals(unitDoc._id)) {
        purchaseProduct.shortUnit = unitDoc.shortUnit;
      }

      return purchaseProduct;
    });

    await purchase.edit({ products: purchaseProducts });
  }
};
