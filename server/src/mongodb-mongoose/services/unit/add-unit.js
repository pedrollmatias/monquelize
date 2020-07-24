'use strict';

const { unitModel } = require('../../models');

module.exports = function addUnit(data) {
  return unitModel.add(data);
};
