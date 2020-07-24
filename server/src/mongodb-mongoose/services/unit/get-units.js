'use strict';

const { unitModel } = require('../../models');

module.exports = function getUnits(query) {
  query = query || {};

  return unitModel.find(query);
};
