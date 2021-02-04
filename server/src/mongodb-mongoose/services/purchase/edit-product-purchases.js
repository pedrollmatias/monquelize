'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function editProductPurchase(productId, productPopulated, session) {
  const purchases = await purchaseModel.get({ 'products.productRef': productId }, session);

  for (const purchase of purchases) {
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.productRef.equals(productId)) {
        purchaseProduct.sku = productPopulated.sku;
        purchaseProduct.name = productPopulated.name;
        purchaseProduct.category = productPopulated.category._id;
        purchaseProduct.unitRef = productPopulated.unit._id;
        purchaseProduct.shortUnit = productPopulated.unit.shortUnit;
      }

      return purchaseProduct;
    });

    return purchase.edit({ products: purchaseProducts });
  }
};
