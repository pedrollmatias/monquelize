'use strict';

const unitModel = require('../../models/unit.model');

module.exports = function addUnit(data) {
  return unitModel.add(data);
};
