'use strict';

const { saleModel } = require('../../models');

module.exports = function getSalesAmountTotalByDayMonth(query) {
  return saleModel.aggregate([
    { $match: query },
    { $unwind: '$products' },
    {
      $project: {
        _id: 1,
        date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        subtotal: { $multiply: ['$products.amount', '$products.price'] },
      },
    },
    { $group: { _id: '$_id', date: { $first: '$date' }, totalValue: { $sum: '$subtotal' } } },
    { $group: { _id: '$date', total: { $sum: '$totalValue' }, amount: { $sum: 1 } } },
    {
      $project: {
        _id: 0,
        total: 1,
        amount: 1,
        date: { $dateFromString: { dateString: '$_id' } },
      },
    },
  ]);
};
