'use strict';

const { saleModel } = require('../../models');

module.exports = function getSalesProductsByCategoryByDateRange(query) {
  return saleModel.aggregate([
    { $match: query },
    { $unwind: '$products' },
    {
      $project: {
        category: '$products.category',
        amount: '$products.amount',
        subtotal: { $multiply: ['$products.amount', '$products.price'] },
      },
    },
    { $group: { _id: '$category', total: { $sum: '$subtotal' }, amount: { $sum: '$amount' } } },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: '_category',
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        amount: 1,
        category: { $arrayElemAt: ['$_category.name', 0] },
      },
    },
  ]);
};
