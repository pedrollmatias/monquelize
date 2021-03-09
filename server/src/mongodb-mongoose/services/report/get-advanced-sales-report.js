'use strict';

const mongoose = require('mongoose');
const { saleModel } = require('../../models');

function castToObjectIdArray(obj) {
  const array = Array.isArray(obj) ? obj : [obj];

  return array.map((element) => mongoose.Types.ObjectId(element));
}

module.exports = function getSalesAmountTotalByDayMonth(query = {}) {
  let match = {};

  const startDate = query.startDate ? new Date(query.startDate) : undefined;
  const endDate = query.endDate ? new Date(query.endDate) : undefined;

  if (startDate && endDate) {
    match = { ...match, date: { $gte: startDate, $lte: endDate } };
  } else if (startDate) {
    match = { ...match, date: { $gte: startDate } };
  } else if (endDate) {
    match = { ...match, date: { $lte: endDate } };
  }

  if (query.categories) {
    match = { ...match, 'products.category': { $in: castToObjectIdArray(query.categories) } };
  }
  if (query.products) {
    match = { ...match, 'products._id': { $in: castToObjectIdArray(query.products) } };
  }
  if (query.units) {
    match = { ...match, 'products.unit.unitRef': { $in: castToObjectIdArray(query.units) } };
  }
  if (query.paymentMethods) {
    match = {
      ...match,
      'products.paymentMethod.paymentMethodRef': { $in: castToObjectIdArray(query.paymentMethods) },
    };
  }
  if (query.sellers) {
    match = { ...match, seller: { $in: castToObjectIdArray(query.sellers) } };
  }

  // console.log(match);

  return saleModel.aggregate([
    { $match: match },
    { $unwind: '$products' },
    {
      $project: {
        _id: 1,
        code: 1,
        customer: 1,
        date: 1,
        subtotal: { $multiply: ['$products.amount', '$products.price'] },
      },
    },
    {
      $group: {
        _id: '$_id',
        code: { $first: '$code' },
        customer: { $first: '$customer' },
        date: { $first: '$date' },
        totalValue: { $sum: '$subtotal' },
      },
    },
  ]);
};
