'use strict';

const { saleModel } = require('../../models');
const {
  query: getProduct,
  decrementInventory: decrementProductInventory,
  incrementInventory: incrementProductInventory,
} = require('../product');

module.exports = async function editSale(saleId, saleData, session) {
  const saleDoc = await saleModel.retrieve(saleId, session);
  const saleObj = saleDoc.toObject();

  const updatedSale = await saleObj.edit(saleData);

  await updatedSale.populate([{ path: 'seller' }]).execPopulate();

  for (const product of updatedSale.products) {
    await incrementInventoryOfRemovedProducts(saleObj, updatedSale, session);
    await decrementInventoryOfAddedProducts(saleObj, updatedSale, session);

    const oldProduct = saleObj.products.find((_product) => _product.productRef.equals(product.productRef));
    const oldProductDoc = await getProduct(oldProduct.productRef);

    await editInventoryOfEditedProduct(oldProductDoc, product, session);
  }

  return updatedSale;
};

async function incrementInventoryOfRemovedProducts(oldSale, newSale) {
  const removedProducts = oldSale.products.filter((_product) =>
    newSale.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
  );

  if (removedProducts.length) {
    for (const removedProduct of removedProducts) {
      await incrementProductInventory(removedProduct.productRef, removedProduct.amount);
    }
  }
}

async function decrementInventoryOfAddedProducts(oldSale, newSale, session) {
  const addedProducts = newSale.products.filter((_updatedProduct) =>
    oldSale.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
  );

  if (addedProducts.length) {
    for (const addedProduct of addedProducts) {
      await decrementProductInventory(addedProduct.productRef, addedProduct.amount, session);
    }
  }
}

async function editInventoryOfEditedProduct(oldProduct, newProduct, session) {
  const diffAmount = newProduct.amount - oldProduct.amount;

  if (diffAmount > 0) {
    await incrementProductInventory(oldProduct._id, diffAmount, session);
  } else if (diffAmount < 0) {
    await decrementProductInventory(oldProduct._id, -diffAmount, session);
  }
}
