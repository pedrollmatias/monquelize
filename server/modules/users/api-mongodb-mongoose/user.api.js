'use strict';

const User = require('./user.model');
const timer = require('../../../timer');

module.exports = {
  async get(req, res, next) {
    timer.startTimer();

    try {
      const query = req.query || {};
      const user = await User.find(query);

      const diffTime = timer.diffTimer();

      res.send({ res: user, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    timer.startTimer();

    try {
      const user = await User.load(req.params.userId);
      const diffTime = timer.diffTimer();

      res.send({ res: user, time: diffTime });
    } catch (err) {
      next(err);
    }

    res.send(req.user);
  },
  async create(req, res, next) {
    timer.startTimer();

    try {
      const user = await User.create(req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: user, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async edit(req, res, next) {
    timer.startTimer();

    try {
      const user = await User.load(req.params.userId);
      const updatedUser = await user.edit(req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: updatedUser, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async toggleBlock(req, res, next) {
    timer.startTimer();

    try {
      const user = await User.load(req.params.userId);
      const updatedUser = await user.editFields({ blocked: !user.blocked });

      const diffTime = timer.diffTimer();

      res.send({ res: updatedUser, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
};
