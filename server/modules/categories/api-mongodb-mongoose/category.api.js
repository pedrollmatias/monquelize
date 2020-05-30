'use strict';

const Category = require('./category.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');
const Product = require('../../products/api-mongodb-mongoose/product.model');

function unpopulate(category) {
  category.parent = category.parent ? category.parent._id || category.parent : undefined;

  return category;
}

module.exports = {
  async load(req, res, next, categoryId) {
    const category = await Category.findById(categoryId).select({ name: 1, parent: 1, path: 1, _id: 1 });

    if (!category) {
      throw new Error('Category not found');
    }
    req.category = category;
    next();
  },
  async get(req, res) {
    let categories;

    if (req.query.getProducts) {
      categories = await Category.find().sort({ path: 1 });
    } else {
      categories = await Category.find().select({ name: 1, parent: 1, path: 1, _id: 1 }).sort({ path: 1 });
    }

    res.send(categories);
  },
  query(req, res) {
    res.send(req.category);
  },
  async create(req, res) {
    const category = await Category.create(req.body);

    res.send(category);
  },
  async edit(req, res) {
    const oldName = req.category.name;
    const updatedCategory = await req.category.editFields(unpopulate(req.body));

    await updatedCategory.updateChildrenPaths(oldName);
    res.send(updatedCategory);
  },
  async remove(req, res) {
    const session = await Category.startSession();

    session.startTransaction();
    try {
      // Get category
      const category = await Category.load(req.params.categoryIdSession, session);

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
      res.sendStatus(200);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },
};
