'use strict';

const { unitModel } = require('../../models');
const { editUnit: editUnitInPurchases } = require('../purchase');
const { editUnit: editUnitInSales } = require('../sale');

module.exports = async function editUnit(unitId, unitData, session) {
  const unitDoc = await unitModel.retrieve(unitId, session);
  const unitObj = unitDoc.toObject();
  const updatedUnit = await unitDoc.edit(unitData);

  if (hasToUpdateInSalesOrPurchases(unitObj, updatedUnit)) {
    await editUnitInPurchases(updatedUnit);
    await editUnitInSales(updatedUnit);
  }

  return updatedUnit;
};

function hasToUpdateInSalesOrPurchases(oldUnit, newUnit) {
  const relevantFields = ['shortUnit'];

  return relevantFields.some((field) => oldUnit[field] !== newUnit[field]);
}
