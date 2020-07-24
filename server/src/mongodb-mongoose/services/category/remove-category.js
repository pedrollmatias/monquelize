'use strict';

const { categoryModel, productModel, saleModel, purchaseModel } = require('../../models');

module.exports = async function removeCategory(categoryId, session) {
  const category = await categoryModel.retrieve(categoryId, session);

  const query = { 'products.category': category._id };
  const sales = await saleModel.find(query);
  const purchases = await purchaseModel.find(query);

  for (const sale of sales) {
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.category.equals(category._id)) {
        saleProduct.category = undefined;
      }

      return saleProduct;
    });

    await sale.edit({ products: saleProducts });
  }

  for (const purchase of purchases) {
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.category.equals(category._id)) {
        purchaseProduct.category = undefined;
      }

      return purchaseProduct;
    });

    await purchase.edit({ products: purchaseProducts });
  }

  const products = await productModel.find({ category: category._id });

  for (const product of products) {
    await product.edit({ category: undefined });
  }

  return category.delete();
};
