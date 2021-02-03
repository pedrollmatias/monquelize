'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function getPurchases(query = {}) {
  return purchaseModel
    .find(query)
    .populate([{ path: 'buyer' }])
    .lean();
};
