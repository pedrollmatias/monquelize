'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function removeCategoryInPurchases(category, session) {
  const purchases = await purchaseModel.get({ 'products.category': category._id }, session);

  for (const purchase of purchases) {
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.category.equals(category._id)) {
        purchaseProduct.category = undefined;
      }

      return purchaseProduct;
    });

    await purchase.edit({ products: purchaseProducts });
  }
};
