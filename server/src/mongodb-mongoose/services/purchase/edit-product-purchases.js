'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function editProductPurchase(productId, productPopulated) {
  const purchases = await purchaseModel.find({ 'products.productRef': productId });

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
