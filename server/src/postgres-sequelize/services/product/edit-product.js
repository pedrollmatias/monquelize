'use strict';

const { Product } = require('../../models');

module.exports = async function editProduct(productId, product) {
  console.log('\n\n');

  console.log(product);
  console.log('\n\n');
  let [, updatedProduct] = await Product.update(product, {
    where: { _id: productId },
    returning: true,
    plain: true,
  });

  updatedProduct = updatedProduct.dataValues;

  return updatedProduct;
};
