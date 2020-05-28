'use strict';

const Product = require('./product.model');

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
    const product = new Product(req.body);
    const productDoc = await product.save();
    const queryPopulate = [
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ];

    await productDoc.populate(queryPopulate).execPopulate();

    res.send(productDoc);
  },
  async edit(req, res) {
    const product = await req.product.edit(req.body);
    const queryPopulate = [
      { path: 'category', select: 'name' },
      { path: 'unit', select: ['unit', 'shortUnit'] },
    ];

    await product.populate(queryPopulate).execPopulate();

    res.send(product);
  },
  async remove(req, res) {
    await req.product.editField({ removed: true });
    res.status(200).end();
  },
};
