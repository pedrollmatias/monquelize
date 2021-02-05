'use strict';

const { productModel } = require('../../models');
const defaultLimit = 1;
const defaultPage = 0;

module.exports = async function getProducts(query) {
  let _query = {};

  if (query.search) {
    _query = {
      $or: [{ name: new RegExp(`^${query.search}`, 'u') }, { sku: new RegExp(`^${query.search}`, 'u') }],
    };
  }

  const limit = Number(query.limit) || defaultLimit;
  const page = query.page ? limit * Number(query.page) : defaultPage;

  const queryPopulate = [
    { path: 'category', select: 'name' },
    { path: 'unit', select: ['unit', 'shortUnit'] },
  ];

  const products = query.pagination
    ? await productModel
        .find(_query)
        .select({ _id: 1, sku: 1, name: 1, category: 1, unit: 1, salePrice: 1, createdAt: 1, currentAmount: 1 })
        .skip(page)
        .limit(limit)
        .populate(queryPopulate)
        .lean()
    : await productModel
        .find(_query)
        .select({ _id: 1, sku: 1, name: 1, category: 1, unit: 1, salePrice: 1, createdAt: 1, currentAmount: 1 })
        .populate(queryPopulate)
        .lean();

  return products;
};
