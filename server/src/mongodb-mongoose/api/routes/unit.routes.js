'use strict';

const express = require('express');
const router = express.Router();
const { unitService } = require('../../services');
const { timer } = require('../../../modules');
const { withTransaction } = require('../middlewares');

module.exports = (app) => {
  app.use('/units', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const units = await unitService.get(req.query);

      const diffTime = timer.diffTimer();

      res.send({ res: units, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    try {
      timer.startTimer();

      const unit = await unitService.add(req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: unit, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:unitId', async (req, res, next) => {
    try {
      timer.startTimer();

      const units = await unitService.query(req.params.unitId);

      const diffTime = timer.diffTimer();

      res.send({ res: units, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:unitId', async (req, res, next) => {
    try {
      timer.startTimer();

      const unit = await withTransaction(async (session) => {
        return unitService.edit(req.params.unitId, req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: unit, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:unitId', async (req, res, next) => {
    try {
      timer.startTimer();

      await withTransaction(async (session) => {
        return unitService.remove(req.params.unitId, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
