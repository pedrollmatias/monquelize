'use strict';

const express = require('express');
const router = express.Router();
const { userService } = require('../../services');
const { timer } = require('../../../modules');

module.exports = (app) => {
  app.use('/users', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const users = await userService.get(req.query);

      const diffTime = timer.diffTimer();

      res.send({ res: users, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    try {
      timer.startTimer();

      const user = await userService.add(req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: user, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:userId', async (req, res, next) => {
    try {
      timer.startTimer();

      const users = await userService.query(req.params.userId);

      const diffTime = timer.diffTimer();

      res.send({ res: users, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:userId', async (req, res, next) => {
    try {
      timer.startTimer();

      const user = await userService.edit(req.params.userId, req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: user, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.put('/:userId', async (req, res, next) => {
    try {
      timer.startTimer();

      await userService.toggleBlock(req.params.userId);

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
