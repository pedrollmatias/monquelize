'use strict';

const { Product, Unit, Category } = require('../../models');

module.exports = function getProducts() {
  return Product.findAll({
    where: {
      removed: false,
    },
    attributes: ['_id', 'sku', 'name', 'salePrice'],
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
};
