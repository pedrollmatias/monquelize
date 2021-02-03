'use strict';

const { productModel } = require('../../models');

module.exports = async function getProduct(productId, options = {}) {
  if (options.populate) {
    const product = await productModel.retrieve(productId);

    return product.execPopulate([
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ]);
  }

  return productModel.retrieve(productId);
};
