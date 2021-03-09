'use strict';

const { Product } = require('../../models');
const validateInventory = require('./validate-inventory');

module.exports = async function adjustInventory(productId, product) {
  validateInventory(product);

  let [, updatedProduct] = await Product.update(product, {
    where: { _id: productId },
    returning: true,
    plain: true,
  });

  updatedProduct = updatedProduct.dataValues;

  return updatedProduct;
};
