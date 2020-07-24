'use strict';

const express = require('express');
const router = express.Router();
const { categoryService } = require('../../services');
const { timer } = require('../../../modules');
const { withTransaction } = require('../middlewares');

module.exports = (app) => {
  app.use('/categories', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const categories = await categoryService.get(req.query);

      const diffTime = timer.diffTimer();

      res.send({ res: categories, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    try {
      timer.startTimer();

      const category = await categoryService.add(req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: category, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:categoryId', async (req, res, next) => {
    try {
      timer.startTimer();

      const categories = await categoryService.query(req.params.categoryId);

      const diffTime = timer.diffTimer();

      res.send({ res: categories, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:categoryId', async (req, res, next) => {
    try {
      timer.startTimer();

      const category = await categoryService.edit(req.params.categoryId, req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: category, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:categoryId', async (req, res, next) => {
    try {
      timer.startTimer();

      await withTransaction(async (session) => {
        return categoryService.remove(req.params.categoryId, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
