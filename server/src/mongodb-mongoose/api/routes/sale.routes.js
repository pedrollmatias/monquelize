'use strict';

const express = require('express');
const router = express.Router();
const { saleService } = require('../../services');
const { timer } = require('../../../modules');
const { withTransaction } = require('../middlewares');

module.exports = (app) => {
  app.use('/sales', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const startDate = new Date(req.query.startDate).toISOString();
      const endDate = new Date(req.query.endDate).toISOString();
      const query = { date: { $gte: startDate, $lte: endDate } };

      const sales = await saleService.get(query);

      const diffTime = timer.diffTimer();

      res.send({ res: sales, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    try {
      timer.startTimer();

      const sale = await withTransaction(async (session) => {
        return saleService.add(req.body, session);
      });

      console.log(sale);
      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:saleId', async (req, res, next) => {
    try {
      timer.startTimer();

      const sales = await saleService.query(req.params.saleId);

      const diffTime = timer.diffTimer();

      res.send({ res: sales, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:saleId', async (req, res, next) => {
    try {
      timer.startTimer();

      const sale = await withTransaction(async (session) => {
        return saleService.edit(req.params.saleId, req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:saleId', async (req, res, next) => {
    try {
      timer.startTimer();

      await withTransaction(async (session) => {
        return saleService.remove(req.params.saleId, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
