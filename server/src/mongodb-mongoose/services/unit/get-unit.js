'use strict';

const { unitModel } = require('../../models');

module.exports = function getUnit(unitId) {
  return unitModel.retrieve(unitId);
};
