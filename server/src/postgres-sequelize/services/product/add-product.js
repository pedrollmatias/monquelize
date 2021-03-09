'use strict';

const { Product, History } = require('../../models');

module.exports = async function addProduct(productData) {
  const product = await Product.create(productData);

  if (productData.currentAmount) {
    const history = await History.create({ amount: productData.currentAmount, movementType: '100' });

    await product.addHistory(history);
  }

  return product;
};
