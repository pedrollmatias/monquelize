'use strict';

const express = require('express');
const router = express.Router();
const { purchaseService } = require('../../services');
const { timer } = require('../../../modules');
const { withTransaction } = require('../middlewares');

module.exports = (app) => {
  app.use('/purchases', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const purchases = await purchaseService.get(req.query);

      const diffTime = timer.diffTimer();

      res.send({ res: purchases, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    try {
      timer.startTimer();

      const purchase = await withTransaction(async (session) => {
        return purchaseService.add(req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: purchase, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:purchaseId', async (req, res, next) => {
    try {
      timer.startTimer();

      const purchases = await purchaseService.query(req.params.purchaseId);

      const diffTime = timer.diffTimer();

      res.send({ res: purchases, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:purchaseId', async (req, res, next) => {
    try {
      timer.startTimer();

      const purchase = await withTransaction(async (session) => {
        return purchaseService.edit(req.params.purchaseId, req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: purchase, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:purchaseId', async (req, res, next) => {
    try {
      timer.startTimer();

      await withTransaction(async (session) => {
        return purchaseService.remove(req.params.purchaseId, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
