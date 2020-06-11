'use strict';

const Sale = require('./sale.model');
const Product = require('../../products/api-mongodb-mongoose/product.model');
const timer = require('../../../timer');

module.exports = {
  async get(req, res, next) {
    timer.startTimer();

    try {
      const query = req.query || {};
      const sale = await Sale.find(query);
      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    timer.startTimer();

    try {
      const sale = await Sale.load(req.param.saleId);
      const queryPopulate = [{ path: 'seller', select: ['name', 'username'] }];

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
      const queryPopulate = [{ path: 'seller', select: ['name', 'username'] }];

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

    if (req.body.status === '400') {
      const session = await Sale.startSession();

      session.startTransaction();
      try {
        const sale = await Sale.load(req.params.saleId, session);
        const updatedSale = await sale.edit(req.body);
        const queryPopulate = [{ path: 'seller', select: ['name', 'username'] }];

        await updatedSale.populate(queryPopulate).execPopulate();

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
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
      }
    } else {
      try {
        const sale = await Sale.load(req.params.saleId);
        const updatedSale = await sale.edit(req.body);
        const queryPopulate = [{ path: 'seller', select: ['name', 'username'] }];

        await updatedSale.populate(queryPopulate).execPopulate();

        const diffTime = timer.diffTimer();

        res.send({ res: updatedSale, time: diffTime });
      } catch (err) {
        next(err);
      }
    }
  },
  async remove(req, res, next) {
    timer.startTimer();
    const session = await Sale.startSession();

    session.startTransaction();
    try {
      const sale = await Sale.load(req.param.saleId, session);

      for (const product of sale.products) {
        const productDoc = Product.load(product.productRef, session);
        const productInventory = product.inventory;
        const productHistory = product.history || [];

        productInventory.currentAmount += productDoc.amount;
        productHistory.push({ date: Date.now(), movementType: '100' });
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
