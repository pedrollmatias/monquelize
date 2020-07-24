'use strict';

const productModel = require('../../models/product.model');

module.exports = async function getProduct(productId) {
  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];
  const product = await productModel.retrieve(productId);

  return product.populate(queryPopulate).execPopulate();
};
