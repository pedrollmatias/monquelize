'use strict';

const { productModel, saleModel } = require('../../models');

module.exports = async function editSale(saleId, saleData, session) {
  const sale = await saleModel.retrieve(saleId, session);
  const _sale = sale.toObject();

  const updatedSale = await sale.edit(saleData);
  const queryPopulate = [{ path: 'seller' }];

  await updatedSale.populate(queryPopulate).execPopulate();

  for (const product of updatedSale.products) {
    const removedProducts = _sale.products.filter((_product) =>
      updatedSale.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
    );

    // Restore inventory of removed products in sale edition
    if (removedProducts.length) {
      for (const removedProduct of removedProducts) {
        const productDoc = await productModel.retrieve(removedProduct.productRef, session);
        const productHistory = productDoc.history || [];
        const currentAmount = productDoc.currentAmount + removedProduct.amount;

        productHistory.push({ date: Date.now(), movementType: '100', amount: removedProduct.amount });
        const data = { currentAmount, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Debit inventory of added products in sale edition
    const addedProducts = updatedSale.products.filter((_updatedProduct) =>
      _sale.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
    );

    if (addedProducts.length) {
      for (const addedProduct of addedProducts) {
        const productDoc = await productModel.retrieve(addedProduct.productRef, session);
        const productHistory = productDoc.history || [];
        const currentAmount = productDoc.currentAmount - addedProduct.amount;

        productHistory.push({ date: Date.now(), movementType: '200', amount: addedProduct.amount });
        const data = { currentAmount, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Change inventory of edited products
    const oldProduct = _sale.products.find((_product) => _product.productRef.equals(product.productRef));
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

  return updatedSale;
};
