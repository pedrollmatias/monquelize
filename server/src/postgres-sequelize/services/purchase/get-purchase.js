'use strict';

const { Purchase } = require('../../models');

module.exports = async function getPurchase(purchaseId) {
  return Purchase.findByPk(purchaseId);
};
