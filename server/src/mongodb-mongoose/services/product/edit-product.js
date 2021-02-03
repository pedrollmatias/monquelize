'use strict';

const { productModel } = require('../../models');
const { editProduct: editProductInSales } = require('../sale');
const { editProduct: editProductInPurchases } = require('../purchase');
const {
  editProduct: editProductInCategory,
  addProduct: addProductInCategory,
  removeProduct: removeProductInCategory,
} = require('../category');
const unpopulate = require('./unpopulate-product');

module.exports = async function editProduct(productId, data) {
  const productDoc = await productModel.retrieve(productId);
  const productObj = productDoc.toObject();
  const updatedProductDoc = await productDoc.edit(data);

  await updatedProductDoc
    .populate([
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ])
    .execPopulate();

  if (hasToUpdateInSalesOrPurchases(productObj, updatedProductDoc)) {
    await editProductInPurchases(updatedProductDoc._id, updatedProductDoc);
    await editProductInSales(updatedProductDoc._id, updatedProductDoc);
  }

  await updateProductInCategory(productObj, unpopulate(updatedProductDoc));

  return updatedProductDoc;
};

function hasToUpdateInSalesOrPurchases(oldProduct, newProduct) {
  const relevantFields = ['sku', 'name', 'category', 'unit'];

  return relevantFields.some((field) => oldProduct[field] !== newProduct[field]);
}

async function updateProductInCategory(oldProduct, newProduct, session) {
  if (oldProduct.category.equals(newProduct.category)) {
    await editProductInCategory(oldProduct._id, newProduct, session);
  } else {
    await addProductInCategory(newProduct.category, newProduct._id);
    await removeProductInCategory(oldProduct.category, oldProduct._id);
  }
}
