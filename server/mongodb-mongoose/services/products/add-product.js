'use strict';

const productModel = require('../../models/product.model');
const categoryModel = require('../../models/product.model');

module.exports = async function addProduct(data, session) {
  const product = await productModel.create(data);

  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];

  await product.populate(queryPopulate).execPopulate();

  if (product.category) {
    const category = await categoryModel.retrieve(product.category._id, session);
    const categoryproductModels = category.products;

    categoryproductModels.push({
      productRef: product._id,
      sku: product.sku,
      name: product.name,
      unit: {
        unitRef: product.unit._id,
        shortUnit: product.unit.shortUnit,
      },
      salePrice: product.salePrice,
    });

    await category.edit({ products: categoryproductModels });
  }

  return product;
};