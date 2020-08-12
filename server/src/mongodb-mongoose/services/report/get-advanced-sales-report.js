'use strict';

const { saleModel } = require('../../models');

module.exports = function getSalesAmountTotalByDayMonth(query) {
  return saleModel.aggregate([
    { $match: query },
    { $unwind: '$products' },
    {
      $project: {
        _id: 1,
        code: 1,
        customer: 1,
        status: 1,
        date: 1,
        subtotal: { $multiply: ['$products.amount', '$products.price'] },
      },
    },
    {
      $group: {
        _id: '$_id',
        code: { $first: '$code' },
        customer: { $first: '$customer' },
        status: { $first: '$status' },
        date: { $first: '$date' },
        totalValue: { $sum: '$subtotal' },
      },
    },
  ]);
};
