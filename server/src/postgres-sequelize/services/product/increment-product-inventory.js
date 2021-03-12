'use strict';

const { History } = require('../../models');

module.exports = async function incrementProductInventory(product, saleId, amount, amountDifference) {
  const history = await History.create({ amount, movementType: '100', saleId: saleId });

  await product.addHistory(history);

  product.currentAmount += amountDifference;

  await product.save();
};
