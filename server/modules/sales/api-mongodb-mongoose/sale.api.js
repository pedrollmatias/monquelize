'use strict';

const Sale = require('./sale.model');
const Product = require('../../product/api-mongodb-mongoose/product.model');

module.exports = {
  async load(req, res, next, saleId) {
    const sale = await Sale.findById(saleId);

    if (!sale) {
      throw new Error('Sale not found');
    }
    req.sale = sale;
    next();
  },
  async get(req, res) {
    const query = req.query || {};
    const sale = await Sale.find(query);

    res.send(sale);
  },
  async query(req, res) {
    const queryPopulate = [{ path: 'products.item' }, { path: 'seller', select: ['name', 'username'] }];

    await req.sale.populate(queryPopulate).execPopulate();

    res.send(req.sale);
  },
  async create(req, res) {
    const session = await Sale.startSession();

    session.startTransaction();
    try {
      const sale = await Sale.create(req.body, session);
      const queryPopulate = [{ path: 'products.item' }, { path: 'seller', select: ['name', 'username'] }];

      await sale.populate(queryPopulate).execPopulate();

      if (sale.status === '300') {
        for (const product of sale.products) {
          const productDoc = Product.load(product.item, session);
          const productInventory = product.inventory;
          const productHistory = product.history || [];

          productInventory.currentAmount -= productDoc.amount;
          productHistory.push({ date: Date.now(), movementType: '200' });
          const data = { inventory: productInventory, history: productHistory };

          await productDoc.editFields(data);
        }
      }

      await session.commitTransaction();
      session.endSession();
      res.send(sale);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(err);
    }
  },
  async edit(req, res) {
    if (req.body.status === '400') {
      const session = await Sale.startSession();

      session.startTransaction();
      try {
        const sale = await Sale.load(req.params.saleId, session);
        const updatedSale = await sale.editFields(req.body);
        const queryPopulate = [{ path: 'products.item' }, { path: 'seller', select: ['name', 'username'] }];

        await updatedSale.populate(queryPopulate).execPopulate();

        for (const product of sale.products) {
          const productDoc = Product.load(product.item, session);
          const productInventory = product.inventory;
          const productHistory = product.history || [];

          productInventory.currentAmount += productDoc.amount;
          productHistory.push({ date: Date.now(), movementType: '100' });
          const data = { inventory: productInventory, history: productHistory };

          await productDoc.editFields(data);
        }

        await session.commitTransaction();
        session.endSession();
        res.send(updatedSale);
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(err);
      }
    } else {
      const sale = await req.sale.editFields(req.body);

      res.send(sale);
    }
  },
  async remove(req, res) {
    const session = await Sale.startSession();

    session.startTransaction();
    try {
      const sale = await Sale.load(req.param.saleId, session);

      for (const product of sale.products) {
        const productDoc = Product.load(product.item, session);
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
      res.sendStatus(200);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(err);
    }
  },
};
