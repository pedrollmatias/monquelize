'use strict';

const { Product, Unit, Category } = require('../../models');

module.exports = function getProductsByCategory() {
  return Category.findAll({
    where: {
      removed: false,
    },
    include: [
      {
        model: Product,
        as: 'products',
        include: [
          {
            model: Unit,
            as: 'unit',
          },
        ],
      },
    ],
  });
};
