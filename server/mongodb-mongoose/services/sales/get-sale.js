'use strict';

const saleModel = require('../../models/sale.model');

module.exports = async function getSale(saleId) {
  const sale = await saleModel.retrieve(saleId);
  const queryPopulate = [{ path: 'seller' }];

  await sale.populate(queryPopulate).execPopulate();

  return sale;
};
