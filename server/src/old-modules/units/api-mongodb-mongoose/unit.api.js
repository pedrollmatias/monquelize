'use strict';

const Unit = require('./unit.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');
const timer = require('../../../timer');

module.exports = {
  async get(req, res, next) {
    timer.startTimer();

    try {
      const query = req.query || {};
      const unit = await Unit.find(query);
      const diffTime = timer.diffTimer();

      res.send({ res: unit, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    timer.startTimer();

    try {
      const unit = await Unit.load(req.params.unitId);
      const diffTime = timer.diffTimer();

      res.send({ res: unit, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    timer.startTimer();

    try {
      const unit = await Unit.create(req.body);
      const diffTime = timer.diffTimer();

      res.send({ res: unit, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async edit(req, res, next) {
    timer.startTimer();
    const session = await Unit.startSession();

    session.startTransaction();
    try {
      // Update unit
      const unit = await Unit.load(req.params.unitId, session);
      const updatedUnit = await unit.edit(req.body);

      // Update product in sales and purchases if unit and shortUnit was modified
      const hasToUpdateInSalesOrPurchases = ['sku', 'name', 'category', 'unit'].some((field) =>
        Object.prototype.hasOwnProperty.call(req.body, field)
      );

      if (hasToUpdateInSalesOrPurchases) {
        const query = { 'products.unit.unitRef': updatedUnit._id };
        const sales = await Sale.find(query);
        const purchases = await Purchase.find(query);

        for (const sale of sales) {
          const saleProducts = sale.products.map((saleProduct) => {
            if (saleProduct.unit && saleProduct.unit.unitRef.equals(updatedUnit._id)) {
              saleProduct.unit.shortUnit = updatedUnit.shortUnit;
            }

            return saleProduct;
          });

          await sale.editFields({ products: saleProducts });
        }

        for (const purchase of purchases) {
          const purchaseProducts = purchase.products.map((purchaseProduct) => {
            if (purchaseProduct.unit && purchaseProduct.unit.unitRef.equals(updatedUnit._id)) {
              purchaseProduct.unit.shortUnit = updatedUnit.shortUnit;
            }

            return purchaseProduct;
          });

          await purchase.editFields({ products: purchaseProducts });
        }
      }

      await session.commitTransaction();
      session.endSession();
      const diffTime = timer.diffTimer();

      res.send({ res: updatedUnit, time: diffTime });
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      next(err);
    }
  },
  async remove(req, res, next) {
    timer.startTimer();
    const session = await Unit.startSession();

    session.startTransaction();
    try {
      // Get unit
      const unit = await Unit.load(req.params.unitId, session);

      // Remove unit reference in sales and purchases
      const query = { 'products.unit.unitRef': unit._id };
      const sales = await Sale.find(query);
      const purchases = await Purchase.find(query);

      for (const sale of sales) {
        const saleProducts = sale.products.map((saleProduct) => {
          if (saleProduct.unit && saleProduct.unit.unitRef.equals(unit._id)) {
            saleProduct.unit.unitRef = undefined;
          }

          return saleProduct;
        });

        await sale.editFields({ products: saleProducts });
      }

      for (const purchase of purchases) {
        const purchaseProducts = purchase.products.map((purchaseProduct) => {
          if (purchaseProduct.unit && purchaseProduct.unit.unitRef.equals(unit._id)) {
            purchaseProduct.unit.unitRef = undefined;
          }

          return purchaseProduct;
        });

        await purchase.editFields({ products: purchaseProducts });
      }

      // Remove unit
      await unit.remove();

      await session.commitTransaction();
      session.endSession();
      const diffTime = timer.diffTimer();

      res.sendStatus({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      next(err);
    }
  },
};
