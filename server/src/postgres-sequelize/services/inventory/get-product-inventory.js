'use strict';

const { Product, History } = require('../../models');

module.exports = function getProductInventory(productId) {
  return Product.findOne({ where: { _id: productId, removed: false }, include: { model: History, as: 'history' } });
};
