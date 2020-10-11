'use strict';

const { Sale } = require('../../models');

module.exports = function getSale(query) {
  return Sale.findAll(query);
};
