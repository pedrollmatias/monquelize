'use strict';

const { Sale } = require('../../models');

module.exports = async function getSale(saleId) {
  return Sale.findByPk(saleId);
};
