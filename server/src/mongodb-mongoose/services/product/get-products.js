'use strict';

const { productModel } = require('../../models');

module.exports = async function getProducts(query) {
  query = query || {};
  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];

  return productModel
    .find(query)
    .select({ _id: 1, sku: 1, name: 1, category: 1, unit: 1, salePrice: 1 })
    .populate(queryPopulate)
    .lean();
};
