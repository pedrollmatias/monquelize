'use strict';

const { Product } = require('../../models');

module.exports = async function getProducts() {
  const { count } = await Product.findAndCountAll({
    where: { removed: false },
  });

  return count;
};
