'use strict';

const { Unit } = require('../../models');

module.exports = function removeUnit(unitId) {
  return Unit.update({ removed: true }, { where: { _id: unitId } });
};
