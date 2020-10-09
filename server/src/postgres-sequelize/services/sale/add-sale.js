'use strict';

const { Sale } = require('../../models');

module.exports = function addSale(sale) {
  return Sale.create(sale);
};
