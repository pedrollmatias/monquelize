'use strict';

const express = require('express');
const router = express.Router();
const { productService } = require('../../services');
const { timer } = require('../../../modules');
const { withTransaction } = require('../middlewares');

module.exports = (app) => {
  app.use('/products', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const products = await productService.get(req.query);

      const diffTime = timer.diffTimer();

      res.send({ res: products, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    try {
      timer.startTimer();

      const product = await withTransaction(async (session) => {
        return productService.add(req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: product, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      const products = await productService.query(req.params.productId);

      const diffTime = timer.diffTimer();

      res.send({ res: products, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      const product = await withTransaction(async (session) => {
        return productService.edit(req.params.productId, req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: product, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      await withTransaction(async (session) => {
        return productService.remove(req.params.productId, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:productId/inventory', async (req, res, next) => {
    try {
      timer.startTimer();

      const product = await withTransaction(async (session) => {
        return productService.adjustInventory(req.params.productId, req.body, session);
      });

      const diffTime = timer.diffTimer();

      res.send({ res: product, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
