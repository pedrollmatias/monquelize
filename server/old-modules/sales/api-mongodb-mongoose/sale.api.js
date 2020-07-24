'use strict';

const Sale = require('./sale.model');
const Product = require('../../products/api-mongodb-mongoose/product.model');
const timer = require('../../../timer');

module.exports = {
  async get(req, res, next) {
    timer.startTimer();

    try {
      const query = req.query || {};
      const queryPopulate = [{ path: 'seller' }];
      const sale = await Sale.find(query).populate(queryPopulate);
      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    timer.startTimer();

    try {
      const sale = await Sale.load(req.params.saleId);
      const queryPopulate = [{ path: 'seller' }];

      await sale.populate(queryPopulate).execPopulate();
      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    timer.startTimer();

    await Sale.createCollection();
    const session = await Sale.startSession();

    session.startTransaction();
    try {
      const sale = await Sale.createSale(req.body, session);
      const queryPopulate = [{ path: 'seller' }];

      await sale.populate(queryPopulate).execPopulate();

      if (sale.status === '300') {
        for (const product of sale.products) {
          const productDoc = await Product.load(product.productRef, session);
          const productInventory = productDoc.inventory;
          const productHistory = productDoc.history || [];

          productInventory.currentAmount -= product.amount;
          productHistory.push({ date: Date.now(), movementType: '200', amount: product.amount });
          const data = { inventory: productInventory, history: productHistory };

          await productDoc.editFields(data);
        }
      }

      await session.commitTransaction();
      session.endSession();
      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
  async edit(req, res, next) {
    timer.startTimer();

    const session = await Sale.startSession();

    session.startTransaction();
    try {
      const sale = await Sale.load(req.params.saleId, session);
      const updatedSale = await sale.edit(req.body);
      const queryPopulate = [{ path: 'seller' }];

      await updatedSale.populate(queryPopulate).execPopulate();
      if (req.body.status === '400') {
        // Restore inventory of all products when sale is canceled
        for (const product of sale.products) {
          const productDoc = await Product.load(product.productRef, session);
          const productInventory = productDoc.inventory;
          const productHistory = productDoc.history || [];

          productInventory.currentAmount += product.amount;
          productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
          const data = { inventory: productInventory, history: productHistory };

          await productDoc.editFields(data);
        }

        await session.commitTransaction();
        session.endSession();
        const diffTime = timer.diffTimer();

        res.send({ res: updatedSale, time: diffTime });
      } else {
        for (const product of updatedSale.products) {
          const removedProducts = sale.products.filter((_product) =>
            updatedSale.products.some((_updatedProduct) => !_updatedProduct.productRef.equals(_product.productRef))
          );

          // Restore inventory of removed products in sale edition
          if (removedProducts.length) {
            for (const removedProduct of removedProducts) {
              const productDoc = await Product.load(removedProduct.productRef, session);
              const productInventory = productDoc.inventory;
              const productHistory = productDoc.history || [];

              productInventory.currentAmount += removedProduct.amount;
              productHistory.push({ date: Date.now(), movementType: '100', amount: removedProduct.amount });
              const data = { inventory: productInventory, history: productHistory };

              await productDoc.editFields(data);
            }
          }

          // Debit inventory of added products in sale edition
          const addedProcuts = updatedSale.products.filter((_updatedProduct) =>
            sale.products.some((_product) => !_product.productRef.equals(_updatedProduct.productRef))
          );

          if (addedProcuts.length) {
            for (const addedProcut of addedProcuts) {
              const productDoc = await Product.load(addedProcut.productRef, session);
              const productInventory = productDoc.inventory;
              const productHistory = productDoc.history || [];

              productInventory.currentAmount -= addedProcut.amount;
              productHistory.push({ date: Date.now(), movementType: '200', amount: addedProcut.amount });
              const data = { inventory: productInventory, history: productHistory };

              await productDoc.editFields(data);
            }
          }

          // Change inventory of edited products
          const oldProduct = sale.products.find((_product) => _product.productRef.equals(product.productRef));
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

        res.send({ res: updatedSale, time: diffTime });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
  async remove(req, res, next) {
    timer.startTimer();
    const session = await Sale.startSession();

    session.startTransaction();
    try {
      const sale = await Sale.load(req.params.saleId, session);

      for (const product of sale.products) {
        const productDoc = await Product.load(product.productRef, session);
        const productInventory = productDoc.inventory;
        const productHistory = productDoc.history || [];

        productInventory.currentAmount += productDoc.amount;
        productHistory.push({ date: Date.now(), movementType: '100', amount: product.amount });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.editFields(data);
      }

      await sale.remove();

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
