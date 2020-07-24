'use strict';

const productModel = require('../../models/product.model');

module.exports = async function getProducts(query) {
  query = query || {};
  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];

  return productModel.find(query).populate(queryPopulate);
};
