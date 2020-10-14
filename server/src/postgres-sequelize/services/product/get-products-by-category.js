'use strict';

const { Product, Unit, Category } = require('../../models');

module.exports = async function getProductsByCategory() {
  const products = await Product.findAll({
    where: {
      removed: false,
    },
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: Unit,
        as: 'unit',
      },
    ],
  });

  const productsByCategoryObj = products.reduce((productsByCategoryObj, product) => {
    if (Reflect.has(productsByCategoryObj, product.categoryId)) {
      productsByCategoryObj[product.categoryId].products.push(product);
    } else {
      productsByCategoryObj[product.categoryId] = {
        category: product.category,
        products: [product],
      };
    }

    return productsByCategoryObj;
  }, {});

  const productsByCategory = Object.keys(productsByCategoryObj).map((categoryId) => productsByCategoryObj[categoryId]);

  return productsByCategory;
};
