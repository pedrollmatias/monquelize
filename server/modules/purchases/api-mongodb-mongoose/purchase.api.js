'use strict';

const Purchase = require('./purchase.model');
const Product = require('../../product/api-mongodb-mongoose/product.model');

module.exports = {
  async load(req, res, next, purchaseId) {
    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      throw new Error('Purchase not found');
    }
    req.purchase = purchase;
    next();
  },
  async get(req, res) {
    const query = req.query || {};
    const purchase = await Purchase.find(query);

    res.send(purchase);
  },
  async query(req, res) {
    const queryPopulate = [{ path: 'products.item' }, { path: 'buyer', select: ['name', 'username'] }];

    await req.purchase.populate(queryPopulate).execPopulate();

    res.send(req.purchase);
  },
  async create(req, res) {
    const session = await Purchase.startSession();

    session.startTransaction();
    try {
      const purchase = await Purchase.create(req.body, session);
      const queryPopulate = [{ path: 'products.item' }, { path: 'buyer', select: ['name', 'username'] }];

      await purchase.populate(queryPopulate).execPopulate();

      if (purchase.status === '300') {
        for (const product of purchase.products) {
          const productDoc = Product.load(product.item, session);
          const productInventory = product.inventory;

          productInventory.currentAmount += productDoc.amount;
          await productDoc.editFields({ inventory: productInventory });
        }
      }

      await session.commitTransaction();
      session.endSession();
      res.send(purchase);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(err);
    }
  },
  async edit(req, res) {
    if (req.body.status === '400') {
      const session = await Purchase.startSession();

      session.startTransaction();
      try {
        const purchase = await Purchase.load(req.params.purchaseIdSession, session);
        const updatedPurchase = await purchase.editFields(req.body);
        const queryPopulate = [{ path: 'products.item' }, { path: 'buyer', select: ['name', 'username'] }];

        await updatedPurchase.populate(queryPopulate).execPopulate();

        for (const product of purchase.products) {
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
        res.send(updatedPurchase);
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(err);
      }
    } else {
      const purchase = await req.purchase.editFields(req.body);

      res.send(purchase);
    }
  },
  async remove(req, res) {
    const session = await Purchase.startSession();

    session.startTransaction();
    try {
      const purchase = await Purchase.load(req.param.purchaseIdSession, session);

      for (const product of purchase.products) {
        const productDoc = Product.load(product.item, session);
        const productInventory = product.inventory;
        const productHistory = product.history || [];

        productInventory.currentAmount -= productDoc.amount;
        productHistory.push({ date: Date.now(), movementType: '200' });
        const data = { inventory: productInventory, history: productHistory };

        await productDoc.editFields(data);
      }

      await purchase.remove();

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
