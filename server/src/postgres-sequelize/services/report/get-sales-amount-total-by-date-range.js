'use strict';

const { Sale, Product } = require('../../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

module.exports = function getSalesAmountTotalByDayMonth(query) {
  return Sale.findAll({
    where: { date: { [Op.between]: [query.startDate, query.endDate] } },
    attributes: [
      'date',
      [sequelize.literal('SUM("products->saleProduct"."amount" * "products->saleProduct"."price")'), 'total'],
      [sequelize.literal('COUNT(DISTINCT "sale"."_id")'), 'amount'],
    ],
    include: [
      {
        model: Product,
        attributes: [],
        as: 'products',
        through: { attributes: [] },
      },
    ],
    group: ['date'],
    raw: true,
  });
};
