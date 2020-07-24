'use strict';

const unitModel = require('../../models/unit.model');

module.exports = function getUnits(query) {
  query = query || {};

  return unitModel.find(query);
};
