'use strict';

const { Unit } = require('../../models');

module.exports = function addUnit(unit) {
  return Unit.create(unit);
};
