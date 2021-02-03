'use strict';

module.exports = function unpopulateProduct(product) {
  const _product = {
    ...product,
    unitRef: product.unit._id,
    shortUnit: product.unit.shortUnit,
    category: product.category._id,
  };

  _product.unit = undefined;
  _product.category = undefined;

  return _product;
};
