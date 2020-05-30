'use strict';

const Product = require('./product.model');
const Category = require('../../categories/api-mongodb-mongoose/category.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');

module.exports = {
  async load(req, res, next, productId) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }
    req.product = product;
    next();
  },
  async get(req, res) {
    const query = req.query || {};
    const product = await Product.find(query);

    res.send(product);
  },
  async query(req, res) {
    const queryPopulate = [
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ];

    await req.product.populate(queryPopulate).execPopulate();

    res.send(req.product);
  },
  async create(req, res) {
    const session = await Product.startSession();

    session.startTransaction();
    try {
      // Add product
      const product = Product.create(req.body, session);

      // Populate product
      const queryPopulate = [
        { path: 'category', select: 'name' },
        { path: 'unit', select: ['unit', 'shortUnit'] },
      ];

      await product.populate(queryPopulate).execPopulate();

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

      await session.commitTransaction();
      session.endSession();
      res.send(product);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },
  async edit(req, res) {
    const session = await Product.startSession();

    session.startTransaction();
    try {
      // Edit product
      const product = await Product.load(req.params.productIdSession, session);
      const updatedProduct = await product.editFields(req.body);

      //Populate product
      const queryPopulate = [
        { path: 'category', select: 'name' },
        { path: 'unit', select: ['unit', 'shortUnit'] },
      ];

      await updatedProduct.populate(queryPopulate).execPopulate();

      // Update product in sales and purchases if sku, name, category, unit was modified
      const hasToUpdateInSalesOrPurchases = ['sku', 'name', 'category', 'unit'].some((field) =>
        Object.prototype.hasOwnProperty.call(req.body, field)
      );

      if (hasToUpdateInSalesOrPurchases) {
        const query = { 'products.productRef': updatedProduct._id };
        const sales = await Sale.find(query);
        const purchases = await Purchase.find(query);

        for (const sale in sales) {
          const saleProducts = sale.products.map((saleProduct) => {
            if (saleProduct.productRef.equals(updatedProduct._id)) {
              saleProduct.sku = updatedProduct.sku;
              saleProduct.name = updatedProduct.name;
              saleProduct.category = (updatedProduct.category && updatedProduct.category._id) || undefined;
              saleProduct.unit = {
                unitRef: updatedProduct.unit._id,
                shortUnit: updatedProduct.unit.shortUnit,
              };
            }

            return saleProduct;
          });

          await sale.editFields({ products: saleProducts });
        }

        for (const purchase in purchases) {
          const purchaseProducts = purchase.products.map((purchaseProduct) => {
            if (purchaseProduct.productRef.equals(updatedProduct._id)) {
              purchaseProduct.sku = updatedProduct.sku;
              purchaseProduct.name = updatedProduct.name;
              purchaseProduct.category = (updatedProduct.category && updatedProduct.category._id) || undefined;
              purchaseProduct.unit = {
                unitRef: updatedProduct.unit._id,
                shortUnit: updatedProduct.unit.shortUnit,
              };
            }

            return purchaseProduct;
          });

          await purchase.editFields({ products: purchaseProducts });
        }
      }

      // Update product in category
      const category = await Category.load(product.category._id, session);
      const categoryProducts = category.products.map((categoryProduct) => {
        if (categoryProduct.productRef.equals(updatedProduct._id)) {
          categoryProduct.sku = updatedProduct.sku;
          categoryProduct.name = updatedProduct.name;
          categoryProduct.unit = {
            unitRef: updatedProduct.unit._id,
            shortUnit: updatedProduct.unit.shortUnit,
          };
          categoryProduct.salePrice = updatedProduct.salePrice;
        }

        return updatedProduct;
      });

      await category.editFields({ products: categoryProducts });

      await session.commitTransaction();
      session.endSession();
      res.send(updatedProduct);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },
  async remove(req, res) {
    const session = await Product.startSession();

    session.startTransaction();
    try {
      // Get product
      const product = await Product.load(req.params.productIdSession, session);

      // Remove product in category
      const category = await Category.load(product.category, session);
      const categoryProducts = category.products.filter((categoryProduct) => !categoryProduct._id.equals(product._id));

      await category.editFields({ products: categoryProducts });

      // Remove product reference in sales and purchases
      const query = { 'products.productRef': product._id };
      const sales = await Sale.find(query);
      const purchases = await Purchase.find(query);

      for (const sale in sales) {
        const saleProducts = sale.products.map((saleProduct) => {
          if (saleProduct.productRef.equals(product._id)) {
            saleProduct.productRef = undefined;
          }

          return saleProduct;
        });

        await sale.editFields({ products: saleProducts });
      }

      for (const purchase in purchases) {
        const purchaseProducts = purchase.products.map((purchaseProduct) => {
          if (purchaseProduct.productRef.equals(product._id)) {
            purchaseProduct.productRef = undefined;
          }

          return purchaseProduct;
        });

        await purchase.editFields({ products: purchaseProducts });
      }

      // Remove product
      await product.remove();

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
