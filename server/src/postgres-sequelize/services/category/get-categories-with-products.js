'use strict';

const { Product, Unit, Category } = require('../../models');

module.exports = async function getProductsByCategory() {
  const categories = await Category.findAll({
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

  return categories;
};
