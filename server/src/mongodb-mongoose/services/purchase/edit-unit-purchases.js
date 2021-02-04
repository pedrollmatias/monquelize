'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function editUnitPurchases(unitDoc, session) {
  const purchases = await purchaseModel.get({ 'products.unitRef': unitDoc._id }, session);

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
