'use strict';

const { Purchase } = require('../../models');

module.exports = function getPurchase(query) {
  return Purchase.findAll(query);
};
