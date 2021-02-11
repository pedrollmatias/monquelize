'use strict';

const { productModel } = require('../../models');
const { editProduct: editProductInSales } = require('../sale');
const { editProduct: editProductInPurchases } = require('../purchase');
const {
  editProduct: editProductInCategory,
  addProduct: addProductInCategory,
  removeProduct: removeProductInCategory,
} = require('../category');

module.exports = async function editProduct(productId, productData, session) {
  const productDoc = await productModel.retrieve(productId, session);

  const productObj = productDoc.toObject();

  const updatedProductDoc = await productDoc.edit(productData);

  await updatedProductDoc
    .populate([
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ])
    .execPopulate();

  if (hasToUpdateInSalesOrPurchases(productObj, updatedProductDoc)) {
    await editProductInPurchases(updatedProductDoc._id, updatedProductDoc, session);
    await editProductInSales(updatedProductDoc._id, updatedProductDoc, session);
  }

  await updateProductInCategory(productObj, updatedProductDoc, session);

  return updatedProductDoc;
};

function hasToUpdateInSalesOrPurchases(oldProduct, newProduct) {
  const relevantFields = ['sku', 'name', 'category', 'unit'];

  return relevantFields.some((field) => oldProduct[field] !== newProduct[field]);
}

async function updateProductInCategory(oldProduct, newProduct, session) {
  console.log(oldProduct);
  console.log(newProduct);
  if (oldProduct.category.equals(newProduct.category._id)) {
    await editProductInCategory(oldProduct.category, newProduct, session);
  } else {
    await addProductInCategory(newProduct.category._id, newProduct, session);
    await removeProductInCategory(oldProduct.category, oldProduct._id, session);
  }
}
