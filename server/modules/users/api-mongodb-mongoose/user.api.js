'use strict';

const User = require('./user.model');

module.exports = {
  async load(req, res, next, userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  },
  async get(req, res) {
    const query = req.query || {};
    const user = await User.find(query);

    res.send(user);
  },
  query(req, res) {
    res.send(req.user);
  },
  async create(req, res) {
    const user = await User.create(req.body);

    res.send(user);
  },
  async edit(req, res) {
    const user = await req.user.edit(req.body);

    res.send(user);
  },
  async block(req, res) {
    await req.user.editFields({ block: true });
    res.sendStatus(200);
  },
};
