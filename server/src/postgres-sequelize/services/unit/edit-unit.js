'use strict';

const { Unit } = require('../../models');

module.exports = async function editUnit(unitId, unit) {
  let [, updatedUnit] = await Unit.update(unit, {
    where: { _id: unitId },
    returning: true,
    plain: true,
  });

  updatedUnit = updatedUnit.dataValues;

  return updatedUnit;
};
