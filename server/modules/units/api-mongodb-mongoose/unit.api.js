'use strict';

const Unit = require('./unit.model');
// const Category = require('../../categories/api-mongodb-mongoose/category.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');

module.exports = {
  async load(req, res, next, unitId) {
    const unit = await Unit.findById(unitId);

    if (!unit) {
      throw new Error('Unit not found');
    }
    req.unit = unit;
    next();
  },
  async get(req, res) {
    const query = req.query || {};
    const unit = await Unit.find(query);

    res.send(unit);
  },
  query(req, res) {
    res.send(req.unit);
  },
  async create(req, res) {
    const unit = await Unit.create(req.body);

    res.send(unit);
  },
  async edit(req, res) {
    const session = await Unit.startSession();

    session.startTransaction();
    try {
      // Update unit
      const unit = await Unit.load(req.params.unitIdSession, session);
      const updatedUnit = await unit.editFields(req.body);

      // Update product in sales and purchases if unit and shortUnit was modified
      const hasToUpdateInSalesOrPurchases = ['sku', 'name', 'category', 'unit'].some((field) =>
        Object.prototype.hasOwnProperty.call(req.body, field)
      );

      if (hasToUpdateInSalesOrPurchases) {
        const query = { 'products.unit.unitRef': updatedUnit._id };
        const sales = await Sale.find(query);
        const purchases = await Purchase.find(query);

        for (const sale in sales) {
          const saleProducts = sale.products.map((saleProduct) => {
            if (saleProduct.unit && saleProduct.unit.unitRef.equals(updatedUnit._id)) {
              saleProduct.unit.shortUnit = updatedUnit.shortUnit;
            }

            return saleProduct;
          });

          await sale.editFields({ products: saleProducts });
        }

        for (const purchase in purchases) {
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
      res.send(updatedUnit);
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      throw err;
    }
  },
  async remove(req, res) {
    const session = await Unit.startSession();

    session.startTransaction();
    try {
      // Get unit
      const unit = await Unit.load(req.params.unitIdSession, session);

      // Remove unit reference in sales and purchases
      const query = { 'products.unit.unitRef': unit._id };
      const sales = await Sale.find(query);
      const purchases = await Purchase.find(query);

      for (const sale in sales) {
        const saleProducts = sale.products.map((saleProduct) => {
          if (saleProduct.unit && saleProduct.unit.unitRef.equals(unit._id)) {
            saleProduct.unit.unitRef = undefined;
          }

          return saleProduct;
        });

        await sale.editFields({ products: saleProducts });
      }

      for (const purchase in purchases) {
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
      res.sendStatus(200);
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      throw err;
    }
  },
};
