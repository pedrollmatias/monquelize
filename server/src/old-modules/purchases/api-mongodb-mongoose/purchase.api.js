'use strict';

const Purchase = require('./purchase.model');
const Product = require('../../products/api-mongodb-mongoose/product.model');
const timer = require('../../../timer');

module.exports = {
  async get(req, res, next) {
    timer.startTimer();

    try {
      const query = req.query || {};
      const queryPopulate = [{ path: 'buyer' }];
      const purchase = await Purchase.find(query).populate(queryPopulate);
      const diffTime = timer.diffTimer();

      res.send({ res: purchase, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    timer.startTimer();

    try {
      const purchase = await Purchase.load(req.params.purchaseId);
      const queryPopulate = [{ path: 'buyer' }];

      await purchase.populate(queryPopulate).execPopulate();
      const diffTime = timer.diffTimer();

      res.send({ res: purchase, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    timer.startTimer();

    await Purchase.createCollection();
    const session = await Purchase.startSession();

    session.startTransaction();
    try {
      const purchase = await Purchase.createPurchase(req.body, session);
      const queryPopulate = [{ path: 'buyer' }];

      await purchase.populate(queryPopulate).execPopulate();

      if (purchase.status === '300') {
        for (const product of purchase.products) {
          const productDoc = await Product.load(product.productRef, session);
          const productInventory = productDoc.inventory;
          const productHistory = productDoc.history || [];

          productInventory.currentAmount += product.amount;
          productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
          const data = { inventory: productInventory, history: productHistory };

          await productDoc.editFields(data);
        }
      }

      await session.commitTransaction();
      session.endSession();
      const diffTime = timer.diffTimer();

      res.send({ res: purchase, time: diffTime });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
  async edit(req, res, next) {
    timer.startTimer();

    const session = await Purchase.startSession();

    session.startTransaction();
    try {
      const purchase = await Purchase.load(req.params.purchaseId, session);
      const updatedPurchase = await purchase.edit(req.body);
      const queryPopulate = [{ path: 'buyer' }];

      await updatedPurchase.populate(queryPopulate).execPopulate();
      if (req.body.status === '400') {
        // Restore inventory of all products when purchase is canceled
        for (const product of purchase.products) {
          const productDoc = await Product.load(product.productRef, session);
          const productInventory = productDoc.inventory;
          const productHistory = productDoc.history || [];

          productInventory.currentAmount -= product.amount;
          productHistory.push({ date: Date.now(), movementType: '200', amount: product.amount });
          const data = { inventory: productInventory, history: productHistory };

          await productDoc.editFields(data);
        }

        await session.commitTransaction();
        session.endSession();
        const diffTime = timer.diffTimer();

        res.send({ res: updatedPurchase, time: diffTime });
      } else {
        for (const product of updatedPurchase.products) {
          const removedProducts = purchase.products.filter((_product) =>
            updatedPurchase.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
          );

          // Restore inventory of removed products in purchase edition
          if (removedProducts.length) {
            for (const removedProduct of removedProducts) {
              const productDoc = await Product.load(removedProduct.productRef, session);
              const productInventory = productDoc.inventory;
              const productHistory = productDoc.history || [];

              productInventory.currentAmount -= removedProduct.amount;
              productHistory.push({ date: Date.now(), movementType: '200', amount: removedProduct.amount });
              const data = { inventory: productInventory, history: productHistory };

              await productDoc.editFields(data);
            }
          }

          // Credit inventory of added products in purchase edition
          const addedProducts = updatedPurchase.products.filter((_updatedProduct) =>
            purchase.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
          );

          if (addedProducts.length) {
            for (const addedProduct of addedProducts) {
              const productDoc = await Product.load(addedProduct.productRef, session);
              const productInventory = productDoc.inventory;
              const productHistory = productDoc.history || [];

              productInventory.currentAmount += addedProduct.amount;
              productHistory.push({ date: Date.now(), movementType: '100', amount: addedProduct.amount });
              const data = { inventory: productInventory, history: productHistory };

              await productDoc.editFields(data);
            }
          }

          // Change inventory of edited products
          const oldProduct = purchase.products.find((_product) => _product.productRef.equals(product.productRef));
          const productDoc = await Product.load(product.productRef, session);
          const productInventory = productDoc.inventory;
          const productHistory = productDoc.history || [];
          const diffAmount = oldProduct.amount - product.amount;

          if (diffAmount > 0) {
            productInventory.currentAmount += product.amount;
            productHistory.push({ date: Date.now(), movementType: '100', amount: diffAmount });
            const data = { inventory: productInventory, history: productHistory };

            await productDoc.editFields(data);
          } else if (diffAmount < 0) {
            productInventory.currentAmount -= product.amount;
            productHistory.push({ date: Date.now(), movementType: '200', amount: -diffAmount });
            const data = { inventory: productInventory, history: productHistory };

            await productDoc.editFields(data);
          }
        }

        await session.commitTransaction();
        session.endSession();
        const diffTime = timer.diffTimer();

        res.send({ res: updatedPurchase, time: diffTime });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
  async remove(req, res, next) {
    timer.startTimer();
    const session = await Purchase.startSession();

    session.startTransaction();
    try {
      const purchase = await Purchase.load(req.params.purchaseId, session);

      for (const product of purchase.products) {
        const productDoc = await Product.load(product.productRef, session);
        const productInventory = productDoc.inventory;
        const productHistory = productDoc.history || [];

        productInventory.currentAmount += productDoc.amount;
        productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.editFields(data);
      }

      await purchase.remove();

      await session.commitTransaction();
      session.endSession();
      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
};
