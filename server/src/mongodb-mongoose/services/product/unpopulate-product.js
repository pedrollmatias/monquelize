'use strict';

module.exports = function unpopulateProduct(productDoc) {
  const productObj = productDoc.toObject();
  const product = {
    ...productObj,
    unit: productObj.unit._id,
    category: productObj.category._id,
  };

  return product;
};
