'use strict';

const { categoryModel } = require('../../models');

module.exports = async function editProductCategory(categoryId, productData, session) {
  const category = await categoryModel.retrieve(categoryId, session);

  const categoryProducts = category.products.map((categoryProduct) => {
    if (categoryProduct.productRef.equals(productData._id)) {
      categoryProduct.sku = productData.sku;
      categoryProduct.name = productData.name;
      categoryProduct.unitRef = productData.unitRef;
      categoryProduct.shortUnit = productData.shortUnit;
      categoryProduct.salePrice = productData.salePrice;
    }

    return categoryProduct;
  });

  return category.edit({ products: categoryProducts });
};
