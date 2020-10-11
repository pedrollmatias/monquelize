'use strict';

const express = require('express');
const router = express.Router();
const { purchaseService } = require('../../services');
const { timer } = require('../../../modules');
const { withTransaction } = require('../middlewares');

function nomalizePurchase(purchase) {
  if (purchase.buyer) {
    purchase.buyer = purchase.buyer._id;
  }

  return purchase;
}

module.exports = (app) => {
  app.use('/purchases', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      const query = { date: { $gte: startDate, $lte: endDate } };

      const purchases = await purchaseService.get(query);

      const diffTime = timer.diffTimer();

      res.send({ res: purchases, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    const _purchase = nomalizePurchase(req.body);

    try {
      timer.startTimer();

      const purchase = await withTransaction(async (session) => {
        return purchaseService.add(_purchase, session);
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
    const _purchase = nomalizePurchase(req.body);

    try {
      timer.startTimer();

      const purchase = await withTransaction(async (session) => {
        return purchaseService.edit(req.params.purchaseId, _purchase, session);
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
