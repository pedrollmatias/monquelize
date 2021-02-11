'use strict';

const { categoryModel } = require('../../models');

module.exports = async function editProductCategory(categoryId, productDataPopulated, session) {
  const category = await categoryModel.retrieve(categoryId, session);

  const categoryProducts = category.products.map((categoryProduct) => {
    if (categoryProduct.productRef.equals(productDataPopulated._id)) {
      categoryProduct.sku = productDataPopulated.sku;
      categoryProduct.name = productDataPopulated.name;
      categoryProduct.unitRef = productDataPopulated.unit._id;
      categoryProduct.shortUnit = productDataPopulated.unit.shortUnit;
      categoryProduct.salePrice = productDataPopulated.salePrice;
    }

    return categoryProduct;
  });

  return category.edit({ products: categoryProducts });
};
