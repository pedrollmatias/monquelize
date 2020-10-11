'use strict';

const { Unit } = require('../../models');

module.exports = async function getUnit() {
  return Unit.findAll({ where: { removed: false } });
};
