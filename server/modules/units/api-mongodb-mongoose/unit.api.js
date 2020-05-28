'use strict';

const Unit = require('./unit.model');

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
    const unit = new Unit(req.body);
    const unitDoc = await unit.save();

    res.send(unitDoc);
  },
  async edit(req, res) {
    const unit = await req.unit.edit(req.body);

    res.send(unit);
  },
  async remove(req, res) {
    await req.unit.remove();
    res.status(200).end();
  },
};
