'use strict';

const { categoryModel } = require('../../models');

module.exports = async function removeProductCategory(categoryId, productId, session) {
  const categoryDoc = await categoryModel.retrieve(categoryId, session);

  const categoryProducts = categoryDoc.products.filter(
    (categoryProduct) => !categoryProduct.productRef.equals(productId)
  );

  return categoryDoc.edit({ products: categoryProducts });
};
