'use strict';

const Category = require('./category.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');
const Product = require('../../products/api-mongodb-mongoose/product.model');
const timer = require('../../../timer');

function unpopulate(category) {
  category.parent = category.parent ? category.parent._id || category.parent : undefined;

  return category;
}

module.exports = {
  async get(req, res, next) {
    timer.startTimer();

    try {
      let categories;

      if (req.query.getProducts) {
        categories = await Category.find().sort({ path: 1 });
      } else {
        categories = await Category.find().select({ name: 1, parent: 1, path: 1, _id: 1 }).sort({ path: 1 });
      }

      const diffTime = timer.diffTimer();

      res.send({ res: categories, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    timer.startTimer();

    try {
      const category = await Category.load(req.params.categoryId);

      const diffTime = timer.diffTimer();

      res.send({ res: category, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    timer.startTimer();

    try {
      const category = await Category.create(req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: category, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async edit(req, res, next) {
    timer.startTimer();

    try {
      const category = await Category.load(req.params.categoryId);
      const oldName = category.name;
      const updatedCategory = await category.edit(unpopulate(req.body));

      await updatedCategory.updateChildrenPaths(oldName);
      const diffTime = timer.diffTimer();

      res.send({ res: updatedCategory, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async remove(req, res, next) {
    timer.startTimer();
    const session = await Category.startSession();

    session.startTransaction();
    try {
      // Get category
      const category = await Category.load(req.params.categoryId, session);

      // Remove category from sales and purchases
      const query = { 'products.category': category._id };
      const sales = await Sale.find(query);
      const purchases = await Purchase.find(query);

      for (const sale of sales) {
        const saleProducts = sale.products.map((saleProduct) => {
          if (saleProduct.category.equals(category._id)) {
            saleProduct.category = undefined;
          }

          return saleProduct;
        });

        await sale.editFields({ products: saleProducts });
      }

      for (const purchase of purchases) {
        const purchaseProducts = purchase.products.map((purchaseProduct) => {
          if (purchaseProduct.category.equals(category._id)) {
            purchaseProduct.category = undefined;
          }

          return purchaseProduct;
        });

        await purchase.editFields({ products: purchaseProducts });
      }

      // Remove cateogry from products
      const products = await Product.find({ category: category._id });

      for (const product of products) {
        await product.editFields({ category: undefined });
      }

      // Remove category
      await category.remove();

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
