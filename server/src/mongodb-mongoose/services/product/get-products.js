'use strict';

const { productModel } = require('../../models');

module.exports = async function getProducts(query) {
  const _query = {};

  if (query.search) {
    _query.$or = [{ name: new RegExp(`/${query.search}`) }, { sku: new RegExp(`/${query.search}`) }];
  }

  _query.$lte = { createdAt: query.createdAt };

  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];

  return productModel
    .find(_query)
    .select({ _id: 1, sku: 1, name: 1, category: 1, unit: 1, salePrice: 1 })
    .sort({ createdAt: 1 })
    .limit(Number(query.limit))
    .lean()
    .populate(queryPopulate);
};
