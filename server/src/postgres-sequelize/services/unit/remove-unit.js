'use strict';

const { Unit, Product } = require('../../models');

module.exports = async function removeUnit(unitId) {
  const products = await Product.findAll({ where: { unit: unitId } });

  if (products.length) {
    throw new Error('Can not remove units which has related products. Remove the unit from related products first.');
  }

  return Unit.destroy({ where: { _id: unitId } });
};
