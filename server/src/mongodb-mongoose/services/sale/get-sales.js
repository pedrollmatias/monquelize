'use strict';

const { saleModel } = require('../../models');

module.exports = async function getSales(query = {}) {
  return saleModel
    .find(query)
    .populate([{ path: 'seller' }])
    .lean();
};
