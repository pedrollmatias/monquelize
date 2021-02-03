'use strict';

const { unitModel } = require('../../models');
const { removeUnit: removeUnitInSales } = require('../sale');
const { removeUnit: removeUnitInPurchases } = require('../purchase');

module.exports = async function removeUnit(unitId, session) {
  const unitDoc = await unitModel.retrieve(unitId, session);

  await removeUnitInSales(unitDoc);
  await removeUnitInPurchases(unitDoc);

  return unitDoc.delete();
};
