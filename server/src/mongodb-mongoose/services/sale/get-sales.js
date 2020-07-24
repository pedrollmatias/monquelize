'use strict';

const { saleModel } = require('../../models');

module.exports = async function getSales(query) {
  query = query || {};
  const queryPopulate = [{ path: 'seller' }];

  return saleModel.find(query).populate(queryPopulate);
};
