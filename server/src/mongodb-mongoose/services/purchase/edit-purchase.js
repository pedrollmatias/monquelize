'use strict';

const { productModel, purchaseModel } = require('../../models');

module.exports = async function editPurchase(purchaseId, data, session) {
  const purchase = await purchaseModel.retrieve(purchaseId, session);
  const _purchase = purchase.toObject();

  const updatedPurchase = await purchase.edit(data);
  const queryPopulate = [{ path: 'buyer' }];

  await updatedPurchase.populate(queryPopulate).execPopulate();

  for (const product of updatedPurchase.products) {
    const removedProducts = _purchase.products.filter((_product) =>
      updatedPurchase.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
    );

    // Restore inventory of removed products in purchase edition
    if (removedProducts.length) {
      for (const removedProduct of removedProducts) {
        const productDoc = await productModel.retrieve(removedProduct.productRef, session);
        const productHistory = productDoc.history || [];
        const currentAmount = productDoc.currentAmount - removedProduct.amount;

        productHistory.push({ date: Date.now(), movementType: '200', amount: removedProduct.amount });
        const data = { currentAmount, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Credit inventory of added products in purchase edition
    const addedProducts = updatedPurchase.products.filter((_updatedProduct) =>
      _purchase.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
    );

    if (addedProducts.length) {
      for (const addedProduct of addedProducts) {
        const productDoc = await productModel.retrieve(addedProduct.productRef, session);
        const productHistory = productDoc.history || [];
        const currentAmount = productDoc.currentAmount + addedProduct.amount;

        productHistory.push({ date: Date.now(), movementType: '100', amount: addedProduct.amount });
        const data = { currentAmount, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Change inventory of edited products
    const oldProduct = _purchase.products.find((_product) => _product.productRef.equals(product.productRef));
    const productDoc = await productModel.retrieve(product.productRef, session);
    const productHistory = productDoc.history || [];
    const diffAmount = product.amount - oldProduct.amount;
    let currentAmount;

    if (diffAmount > 0) {
      currentAmount = productDoc.currentAmount + product.amount;
      productHistory.push({ date: Date.now(), movementType: '100', amount: diffAmount });
      const data = { currentAmount, history: productHistory };

      await productDoc.edit(data);
    } else if (diffAmount < 0) {
      currentAmount = productDoc.currentAmount - product.amount;
      productHistory.push({ date: Date.now(), movementType: '200', amount: -diffAmount });
      const data = { currentAmount, history: productHistory };

      await productDoc.edit(data);
    }
  }

  return updatedPurchase;
};
