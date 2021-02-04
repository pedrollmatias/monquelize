'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function removeProductPurchase(productId, session) {
  const purchases = await purchaseModel.find({ 'products.productRef': productId }, session);

  for (const purchase of purchases) {
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.productRef.equals(productId)) {
        purchaseProduct.productRef = undefined;
      }

      return purchaseProduct;
    });

    await purchase.edit({ products: purchaseProducts });
  }
};
