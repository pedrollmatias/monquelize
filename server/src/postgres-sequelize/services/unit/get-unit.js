'use strict';

const { Unit } = require('../../models');

module.exports = async function getUnit(unitId) {
  return Unit.findOne({ where: { _id: unitId } });
};
