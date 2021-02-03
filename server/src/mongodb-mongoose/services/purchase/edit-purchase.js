'use strict';

const { purchaseModel } = require('../../models');
const {
  query: getProduct,
  decrementInventory: decrementProductInventory,
  incrementInventory: incrementProductInventory,
} = require('../product');

module.exports = async function editPurchase(purchaseId, purchaseData) {
  const purchaseDoc = await purchaseModel.retrieve(purchaseId);
  const purchaseObj = purchaseDoc.toObject();

  const updatedPurchase = await purchaseObj.edit(purchaseData);

  await updatedPurchase.populate([{ path: 'seller' }]).execPopulate();

  for (const product of updatedPurchase.products) {
    await decrementInventoryOfRemovedProducts(purchaseObj, updatedPurchase);
    await incrementInventoryOfAddedProducts(purchaseObj, updatedPurchase);

    const oldProduct = purchaseObj.products.find((_product) => _product.productRef.equals(product.productRef));
    const oldProductDoc = await getProduct(oldProduct.productRef);

    await editInventoryOfEditedProduct(oldProductDoc, product);
  }

  return updatedPurchase;
};

async function decrementInventoryOfRemovedProducts(oldPurchase, newPurchase) {
  const removedProducts = oldPurchase.products.filter((_product) =>
    newPurchase.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
  );

  if (removedProducts.length) {
    for (const removedProduct of removedProducts) {
      await decrementProductInventory(removedProduct.productRef, removedProduct.amount);
    }
  }
}

async function incrementInventoryOfAddedProducts(oldPurchase, newPurchase) {
  const addedProducts = newPurchase.products.filter((_updatedProduct) =>
    oldPurchase.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
  );

  if (addedProducts.length) {
    for (const addedProduct of addedProducts) {
      await incrementProductInventory(addedProduct.productRef, addedProduct.amount);
    }
  }
}

async function editInventoryOfEditedProduct(oldProduct, newProduct) {
  const diffAmount = newProduct.amount - oldProduct.amount;

  if (diffAmount > 0) {
    await incrementProductInventory(oldProduct._id, diffAmount);
  } else if (diffAmount < 0) {
    await decrementProductInventory(oldProduct._id, -diffAmount);
  }
}
