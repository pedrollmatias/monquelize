'use strict';

const { categoryModel } = require('../../models');

module.exports = async function addProductCategory(categoryId, productPopulated, session) {
  const categoryDoc = await categoryModel.retrieve(categoryId, session);
  const categoryProducts = [
    ...categoryDoc.products,
    {
      productRef: productPopulated._id,
      sku: productPopulated.sku,
      name: productPopulated.name,
      unitRef: productPopulated.unit._id,
      shortUnit: productPopulated.unit.shortUnit,
      salePrice: productPopulated.salePrice,
    },
  ];

  return categoryDoc.edit({ products: categoryProducts });
};
