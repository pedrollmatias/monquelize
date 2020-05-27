'use strict';

const Sale = require('./sale.model');

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
  query(req, res) {
    res.send(req.sale);
  },
  async create(req, res) {
    const sale = new Sale(req.body);
    const saleDoc = await sale.save();

    res.send(saleDoc);
  },
  async edit(req, res) {
    const sale = await req.sale.edit(req.body);

    res.send(sale);
  },
  async remove(req, res) {
    await req.sale.remove();
    res.status(200).end();
  },
};
