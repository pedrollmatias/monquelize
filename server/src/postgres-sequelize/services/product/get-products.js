'use strict';

const { Product, Unit, Category } = require('../../models');
const { Op } = require('sequelize');
const defaultLimit = 1;
const defaultPage = 0;

module.exports = async function getProducts(query) {
  let whereClause = {
    removed: false,
  };

  if (query.search) {
    whereClause = {
      ...whereClause,
      [Op.or]: [{ name: { [Op.like]: `${query.search}%` } }, { sku: { [Op.like]: `${query.search}%` } }],
    };
  }

  const limit = Number(query.limit) || defaultLimit;
  const page = query.page ? limit * Number(query.page) : defaultPage;

  const products = await Product.findAll({
    where: whereClause,
    attributes: ['_id', 'sku', 'name', 'salePrice', 'createdAt'],
    order: [['createdAt', 'ASC']],
    limit,
    offset: page,
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: Unit,
        as: 'unit',
      },
    ],
  });

  return products;
};
