'use strict';

module.exports = function unpopulateProduct(productDoc) {
  const productObj = productDoc.toObject();
  const product = {
    ...productObj,
    unitRef: productObj.unit._id,
    shortUnit: productObj.unit.shortUnit,
    category: productObj.category._id,
  };

  product.unit = undefined;
  product.category = undefined;

  return product;
};
