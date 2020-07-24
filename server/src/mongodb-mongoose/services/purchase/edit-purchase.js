'use strict';

const { productModel, purchaseModel } = require('../../models');

module.exports = async function editPurchase(purchaseId, data, session) {
  const purchase = await purchaseModel.retrieve(purchaseId, session);
  const updatedPurchase = await purchase.edit(data);
  const queryPopulate = [{ path: 'buyer' }];

  await updatedPurchase.populate(queryPopulate).execPopulate();

  if (data.status === '400') {
    // Restore inventory of all products when purchase is canceled
    for (const product of purchase.products) {
      const productDoc = await productModel.retrieve(product.productRef, session);
      const productInventory = productDoc.inventory;
      const productHistory = productDoc.history || [];

      productInventory.currentAmount -= product.amount;
      productHistory.push({ date: Date.now(), movementType: '200', amount: product.amount });
      const data = { inventory: productInventory, history: productHistory };

      await productDoc.edit(data);
    }

    return updatedPurchase;
  }

  for (const product of updatedPurchase.products) {
    const removedProducts = purchase.products.filter((_product) =>
      updatedPurchase.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
    );

    // Restore inventory of removed products in purchase edition
    if (removedProducts.length) {
      for (const removedProduct of removedProducts) {
        const productDoc = await productModel.retrieve(removedProduct.productRef, session);
        const productInventory = productDoc.inventory;
        const productHistory = productDoc.history || [];

        productInventory.currentAmount -= removedProduct.amount;
        productHistory.push({ date: Date.now(), movementType: '200', amount: removedProduct.amount });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Credit inventory of added products in purchase edition
    const addedProducts = updatedPurchase.products.filter((_updatedProduct) =>
      purchase.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
    );

    if (addedProducts.length) {
      for (const addedProduct of addedProducts) {
        const productDoc = await productModel.retrieve(addedProduct.productRef, session);
        const productInventory = productDoc.inventory;
        const productHistory = productDoc.history || [];

        productInventory.currentAmount += addedProduct.amount;
        productHistory.push({ date: Date.now(), movementType: '100', amount: addedProduct.amount });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Change inventory of edited products
    const oldProduct = purchase.products.find((_product) => _product.productRef.equals(product.productRef));
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productInventory = productDoc.inventory;
    const productHistory = productDoc.history || [];
    const diffAmount = oldProduct.amount - product.amount;

    if (diffAmount > 0) {
      productInventory.currentAmount += product.amount;
      productHistory.push({ date: Date.now(), movementType: '100', amount: diffAmount });
      const data = { inventory: productInventory, history: productHistory };

      await productDoc.edit(data);
    } else if (diffAmount < 0) {
      productInventory.currentAmount -= product.amount;
      productHistory.push({ date: Date.now(), movementType: '200', amount: -diffAmount });
      const data = { inventory: productInventory, history: productHistory };

      await productDoc.edit(data);
    }
  }

  return updatedPurchase;
};
