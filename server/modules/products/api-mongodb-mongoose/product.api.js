'use strict';

const Product = require('./product.model');
const Category = require('../../categories/api-mongodb-mongoose/category.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');
const utils = require('../../../utils');

function hasToUpdateInSalesOrPurchases(oldProduct, newProduct) {
  const relevantFields = ['sku', 'name', 'category', 'unit'];

  return relevantFields.some((field) => oldProduct[field] !== newProduct[field]);
}

module.exports = {
  async get(req, res, next) {
    const startTime = process.hrtime();

    try {
      const query = req.query || {};
      const queryPopulate = [
        { path: 'category', select: 'name' },
        { path: 'unit', select: ['unit', 'shortUnit'] },
      ];
      const product = await Product.find(query).populate(queryPopulate);
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: product, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    const startTime = process.hrtime();

    try {
      const queryPopulate = [
        { path: 'category', select: 'name' },
        { path: 'unit', select: ['unit', 'shortUnit'] },
      ];
      const product = await Product.load(req.params.productId);

      await product.populate(queryPopulate).execPopulate();

      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: product, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    const startTime = process.hrtime();
    const session = await Product.startSession();

    session.startTransaction();
    try {
      // Add product
      const product = await Product.create(req.body);

      // Populate product
      const queryPopulate = [
        { path: 'category', select: 'name' },
        { path: 'unit', select: ['unit', 'shortUnit'] },
      ];

      await product.populate(queryPopulate).execPopulate();

      if (product.category) {
        // Add prodcut in category
        const category = await Category.load(product.category._id, session);
        const categoryProducts = category.products;

        categoryProducts.push({
          productRef: product._id,
          sku: product.sku,
          name: product.name,
          unit: {
            unitRef: product.unit._id,
            shortUnit: product.unit.shortUnit,
          },
          salePrice: product.salePrice,
        });

        await category.editFields({ products: categoryProducts });
      }

      await session.commitTransaction();
      session.endSession();
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: product, time: diffTime });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
  async edit(req, res, next) {
    const startTime = process.hrtime();
    const session = await Product.startSession();

    session.startTransaction();
    try {
      // Edit product
      let product = await Product.load(req.params.productId, session);
      const productObj = product.toObject();
      const updatedProduct = await product.edit(req.body);

      product = productObj; // Restore old product object

      //Populate product
      const queryPopulate = [
        { path: 'category', select: 'name' },
        { path: 'unit', select: ['unit', 'shortUnit'] },
      ];

      await updatedProduct.populate(queryPopulate).execPopulate();

      // Update product in sales and purchases if sku, name, category, unit was modified
      if (hasToUpdateInSalesOrPurchases(product, updatedProduct)) {
        const query = { 'products.productRef': updatedProduct._id };
        const sales = await Sale.find(query);
        const purchases = await Purchase.find(query);

        for (const sale in sales) {
          await sale.editProduct(updatedProduct);
        }

        for (const purchase in purchases) {
          await purchase.editProduct(updatedProduct);
        }
      }

      // Update product in category
      if (updatedProduct.category) {
        if (!product.category) {
          // Add category
          const category = await Category.load(product.category, session);

          await category.addProduct(updatedProduct.toObject());
        } else if (product.category && product.category.equals(updatedProduct.category._id)) {
          // Same category
          const category = await Category.load(updatedProduct.category._id, session);

          await category.editProcut(updatedProduct);
        } else if (product.category && !product.category.equals(updatedProduct.category._id)) {
          // Change category
          const oldCategory = await Category.load(product.category, session);
          const category = await Category.load(updatedProduct.category._id, session);

          await oldCategory.removeProduct(updatedProduct._id);
          await category.addProduct(updatedProduct.toObject());
        }
      } else {
        if (product.category) {
          // Remove category
          const category = await Category.load(product.category, session);

          await category.removeProduct(updatedProduct._id);
        }
      }

      await session.commitTransaction();
      session.endSession();
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: updatedProduct, time: diffTime });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
  async remove(req, res, next) {
    const startTime = process.hrtime();
    const session = await Product.startSession();

    session.startTransaction();
    try {
      // Get product
      const product = await Product.load(req.params.productId, session);

      // Remove product in category
      if (product.category) {
        const category = await Category.load(product.category, session);

        await category.removeProduct(product._id);
      }

      // Remove product reference in sales and purchases
      const query = { 'products.productRef': product._id };
      const sales = await Sale.find(query);
      const purchases = await Purchase.find(query);

      for (const sale in sales) {
        await sale.removeProduct(product._id);
      }

      for (const purchase in purchases) {
        await purchase.removeProduct(product._id);
      }

      // Remove product
      await product.remove();

      await session.commitTransaction();
      session.endSession();
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  },
};
