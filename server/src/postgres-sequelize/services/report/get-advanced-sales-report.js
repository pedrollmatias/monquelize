'use strict';

const { Sale, Product, User, PaymentMethod } = require('../../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

function getSaleWhereClause(query) {
  let saleWhereClause = {};
  let saleIncludes = [];

  const startDate = query.startDate ? new Date(query.startDate) : undefined;
  const endDate = query.endDate ? new Date(query.endDate) : undefined;

  if (startDate && endDate) {
    saleWhereClause = {
      ...saleWhereClause,
      date: {
        [Op.between]: [query.startDate, query.endDate],
      },
    };
  }

  if (startDate) {
    saleWhereClause = {
      ...saleWhereClause,
      date: {
        [Op.gte]: startDate,
      },
    };
  }

  if (endDate) {
    saleWhereClause = {
      ...saleWhereClause,
      date: {
        [Op.lte]: endDate,
      },
    };
  }

  if (query.sellers) {
    saleWhereClause = { ...saleWhereClause, sellerId: query.sellers };
    saleIncludes = [...saleIncludes, { model: User, attributes: [] }];
  }

  if (query.PaymentMethods) {
    saleWhereClause = { ...saleWhereClause, paymentMethodId: query.PaymentMethods };
    saleIncludes = [
      ...saleIncludes,
      {
        model: PaymentMethod,
        as: 'paymentMethod',
        attributes: [],
      },
    ];
  }

  return { saleWhereClause, saleIncludes };
}

function getProductWhereClause(query) {
  let productWhereClause = {};

  if (query.categories) {
    productWhereClause = { ...productWhereClause, categoryId: query.categories };
  }

  if (query.units) {
    productWhereClause = { ...productWhereClause, unitId: query.units };
  }

  if (query.products) {
    productWhereClause = { ...productWhereClause, _id: query.products };
  }

  return productWhereClause;
}

module.exports = async function getAdvancesSalesReport(query = {}) {
  const { saleWhereClause, saleIncludes } = getSaleWhereClause(query);
  const productWhereClause = getProductWhereClause(query);

  return Sale.findAll({
    where: saleWhereClause,
    attributes: [
      '_id',
      'customer',
      'date',
      [sequelize.literal('SUM("products->saleProduct"."amount" * "products->saleProduct"."price")'), 'total'],
    ],
    include: [
      ...saleIncludes,
      {
        model: Product,
        attributes: [],
        as: 'products',
        through: { attributes: [] },
        where: productWhereClause,
      },
    ],
    group: ['sale._id'],
    raw: true,
  });
};
