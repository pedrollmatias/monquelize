'use strict';

const { purchaseModel } = require('../../models');
const {
  query: getProduct,
  decrementInventory: decrementProductInventory,
  incrementInventory: incrementProductInventory,
} = require('../product');

module.exports = async function editPurchase(purchaseId, purchaseData, session) {
  const purchaseDoc = await purchaseModel.retrieve(purchaseId, session);
  const purchaseObj = purchaseDoc.toObject();

  const updatedPurchase = await purchaseObj.edit(purchaseData);

  await updatedPurchase.populate([{ path: 'seller' }]).execPopulate();

  for (const product of updatedPurchase.products) {
    await decrementInventoryOfRemovedProducts(purchaseObj, updatedPurchase, session);
    await incrementInventoryOfAddedProducts(purchaseObj, updatedPurchase, session);

    const oldProduct = purchaseObj.products.find((_product) => _product.productRef.equals(product.productRef));
    const oldProductDoc = await getProduct(oldProduct.productRef);

    await editInventoryOfEditedProduct(oldProductDoc, product, session);
  }

  return updatedPurchase;
};

async function decrementInventoryOfRemovedProducts(oldPurchase, newPurchase, session) {
  const removedProducts = oldPurchase.products.filter((_product) =>
    newPurchase.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
  );

  if (removedProducts.length) {
    for (const removedProduct of removedProducts) {
      await decrementProductInventory(removedProduct.productRef, removedProduct.amount, session);
    }
  }
}

async function incrementInventoryOfAddedProducts(oldPurchase, newPurchase, session) {
  const addedProducts = newPurchase.products.filter((_updatedProduct) =>
    oldPurchase.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
  );

  if (addedProducts.length) {
    for (const addedProduct of addedProducts) {
      await incrementProductInventory(addedProduct.productRef, addedProduct.amount, session);
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
