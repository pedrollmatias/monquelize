'use strict';

const { Product, Category, Unit } = require('../../models');

module.exports = function getInventory(query) {
  return Product.findAll({
    where: { ...query, removed: false },
    include: [
      { model: Category, attributes: ['name'] },
      { model: Unit, attributes: ['unit', 'shortUnit'] },
    ],
  });
};
