'use strict';

const { Product } = require('../../models');

module.exports = function removeProduct(productId) {
  return Product.update({ removed: true }, { where: { _id: productId } });
};
