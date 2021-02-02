'use strict';

const { productModel } = require('../../models');

module.exports = async function getProduct(productId) {
  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];
  const product = await productModel.retrieve(productId);

  return product.execPopulate(queryPopulate);
};
