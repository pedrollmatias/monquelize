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
  query(req, res) {
    res.send(req.product);
  },
  async create(req, res) {
    const product = new Product(req.body);
    const productDoc = await product.save();

    res.send(productDoc);
  },
  async edit(req, res) {
    const product = await req.product.edit(req.body);

    res.send(product);
  },
  async remove(req, res) {
    await req.product.remove();
    res.status(200).end();
  },
};
