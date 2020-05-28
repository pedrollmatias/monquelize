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
    const user = new User(req.body);
    const userDoc = await user.save();

    res.send(userDoc);
  },
  async edit(req, res) {
    const user = await req.user.edit(req.body);

    res.send(user);
  },
  async block(req, res) {
    await req.user.remove();
    res.status(200).end();
  },
};
