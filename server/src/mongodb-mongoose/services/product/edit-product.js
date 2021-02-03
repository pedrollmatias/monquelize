'use strict';

const { productModel, saleModel, purchaseModel } = require('../../models');
const {
  editProduct: editProductInCategory,
  addProduct: addProductInCategory,
  removeProduct: removeProductInCategory,
} = require('../category');

const unpopulate = require('./unpopulate-product');

module.exports = async function editProduct(productId, data, session) {
  const productDoc = await productModel.retrieve(productId, session);
  const updatedProductDoc = await productDoc.edit(data);

  await updatedProductDoc
    .populate([
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ])
    .execPopulate();

  if (hasToUpdateInSalesOrPurchases(productDoc, updatedProductDoc)) {
    await updateProductInSalesAndPurschases(updatedProductDoc);
  }

  await updateProductInCategory(productDoc, unpopulate(updatedProductDoc));

  return updatedProductDoc;
};

function hasToUpdateInSalesOrPurchases(oldProduct, newProduct) {
  const relevantFields = ['sku', 'name', 'category', 'unit'];

  return relevantFields.some((field) => oldProduct[field] !== newProduct[field]);
}

async function updateProductInSalesAndPurschases(product) {
  const query = { 'products.productRef': product._id };
  const sales = await saleModel.find(query);
  const purchases = await purchaseModel.find(query);

  for (const sale of sales) {
    await sale.editProduct(product);
  }

  for (const purchase of purchases) {
    await purchase.editProduct(product);
  }
}

async function updateProductInCategory(oldProduct, newProduct, session) {
  if (oldProduct.category.equals(newProduct.category)) {
    await editProductInCategory(oldProduct._id, newProduct, session);
  } else {
    await addProductInCategory(newProduct.category, newProduct._id);
    await removeProductInCategory(oldProduct.category, oldProduct._id);
  }
}
