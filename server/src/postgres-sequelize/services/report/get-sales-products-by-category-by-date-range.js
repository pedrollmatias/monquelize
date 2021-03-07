'use strict';

const { Sale, Product, Category } = require('../../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

module.exports = function getSalesProductsByCategoryByDateRange(query) {
  return Sale.findAll({
    where: { date: { [Op.between]: [query.startDate, query.endDate] } },
    attributes: [
      'products.category._id',
      [sequelize.literal('SUM("products->saleProduct"."amount" * "products->saleProduct"."price")'), 'total'],
      [sequelize.literal('SUM("products->saleProduct"."amount")'), 'amount'],
    ],
    include: [
      {
        model: Product,
        attributes: [],
        as: 'products',
        through: { attributes: [] },
        include: [
          {
            model: Category,
            as: 'category',
          },
        ],
      },
    ],
    group: ['products.category._id'],
    raw: true,
  });
};
