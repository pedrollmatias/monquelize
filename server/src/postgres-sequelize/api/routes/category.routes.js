'use strict';

const express = require('express');
const router = express.Router();
const { categoryService } = require('../../services');
const { timer } = require('../../../modules');
const { sequelize } = require('../../../loaders/databases/postgres-sequelize');

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

  router.get('/products', async (req, res, next) => {
    try {
      timer.startTimer();

      const categories = await categoryService.getWithProducts();

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
    timer.startTimer();

    const t = await sequelize.transaction();

    try {
      const category = await categoryService.edit(req.params.categoryId, req.body);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: category, time: diffTime });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  });

  router.delete('/:categoryId', async (req, res, next) => {
    timer.startTimer();

    const t = await sequelize.transaction();

    try {
      await categoryService.remove(req.params.categoryId);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  });
};
