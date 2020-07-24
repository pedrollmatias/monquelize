'use strict';

const { purchaseModel } = require('../../models');

module.exports = async function getPurchases(query) {
  query = query || {};
  const queryPopulate = [{ path: 'buyer' }];

  return purchaseModel.find(query).populate(queryPopulate);
};
