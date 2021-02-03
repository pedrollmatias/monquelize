'use strict';

const { categoryModel } = require('../../models');

module.exports = async function addProductCategory(categoryId, product) {
  const categoryDoc = await categoryModel.retrieve(categoryId);
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

  await categoryDoc.edit({ products: categoryProducts });
};
