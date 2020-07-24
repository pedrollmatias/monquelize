'use strict';

const unitModel = require('../../models/unit.model');

module.exports = function getUnit(unitId) {
  return unitModel.retrieve(unitId);
};
