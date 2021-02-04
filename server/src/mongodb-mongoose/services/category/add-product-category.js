'use strict';

const { categoryModel } = require('../../models');

module.exports = async function addProductCategory(categoryId, product, session) {
  const categoryDoc = await categoryModel.retrieve(categoryId, session);
  const categoryProducts = [
    ...categoryDoc.products,
    {
      productRef: product._id,
      sku: product.sku,
      name: product.name,
      unitRef: product.unitRef,
      shortUnit: product.shortUnit,
      salePrice: product.salePrice,
    },
  ];

  return categoryDoc.edit({ products: categoryProducts });
};
