'use strict';

const { productModel, saleModel } = require('../../models');

module.exports = async function editSale(saleId, data, session) {
  const sale = await saleModel.retrieve(saleId, session);
  const updatedSale = await sale.edit(data);
  const queryPopulate = [{ path: 'seller' }];

  await updatedSale.populate(queryPopulate).execPopulate();
  if (data.status === '400') {
    // Restore inventory of all products when sale is canceled
    for (const product of sale.products) {
      const productDoc = await productModel.retrieve(product.productRef, session);
      const productInventory = productDoc.inventory;
      const productHistory = productDoc.history || [];

      productInventory.currentAmount += product.amount;
      productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
      const data = { inventory: productInventory, history: productHistory };

      await productDoc.edit(data);
    }

    return updatedSale;
  }

  for (const product of updatedSale.products) {
    const removedProducts = sale.products.filter((_product) =>
      updatedSale.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
    );

    // Restore inventory of removed products in sale edition
    if (removedProducts.length) {
      for (const removedProduct of removedProducts) {
        const productDoc = await productModel.retrieve(removedProduct.productRef, session);
        const productInventory = productDoc.inventory;
        const productHistory = productDoc.history || [];

        productInventory.currentAmount += removedProduct.amount;
        productHistory.push({ date: Date.now(), movementType: '100', amount: removedProduct.amount });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Debit inventory of added products in sale edition
    const addedProducts = updatedSale.products.filter((_updatedProduct) =>
      sale.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
    );

    if (addedProducts.length) {
      for (const addedProduct of addedProducts) {
        const productDoc = await productModel.retrieve(addedProduct.productRef, session);
        const productInventory = productDoc.inventory;
        const productHistory = productDoc.history || [];

        productInventory.currentAmount -= addedProduct.amount;
        productHistory.push({ date: Date.now(), movementType: '200', amount: addedProduct.amount });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.edit(data);
      }
    }

    // Change inventory of edited products
    const oldProduct = sale.products.find((_product) => _product.productRef.equals(product.productRef));
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

  return updatedSale;
};
