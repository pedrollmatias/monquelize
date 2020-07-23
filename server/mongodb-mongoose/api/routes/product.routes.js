'use strict';

const express = require('express');
const router = express.Router();
const productService = require('../../services/products');
const timer = require('../../../timer');
const { withTransaction } = require('../middlewares');

module.exports = (app) => {
  app.use('/products', router);

  router.get('/', async (req, res) => {
    timer.startTimer();

    const products = await productService.getProducts(req.query);

    const diffTime = timer.diffTimer();

    res.send({ res: products, time: diffTime });
  });

  router.post('/add', async (req, res) => {
    timer.startTimer();

    const product = await withTransaction(async (session) => {
      return productService.addProduct(req.body, session);
    });

    const diffTime = timer.diffTimer();

    res.send({ res: product, time: diffTime });
  });

  router.get('/:productId', async (req, res) => {
    timer.startTimer();

    const products = await productService.getProduct(req.params.productId);

    const diffTime = timer.diffTimer();

    res.send({ res: products, time: diffTime });
  });

  router.post('/:productId', async (req, res) => {
    timer.startTimer();

    const product = await withTransaction(async (session) => {
      return productService.editProduct(req.params.productId, req.body, session);
    });

    const diffTime = timer.diffTimer();

    res.send({ res: product, time: diffTime });
  });

  router.remove('/:productId', async (req, res) => {
    timer.startTimer();

    await withTransaction(async (session) => {
      return productService.removeProduct(req.params.productId, session);
    });

    const diffTime = timer.diffTimer();

    res.send({ res: { status: 200 }, time: diffTime });
  });

  router.post('/:productId/inventory', async (req, res) => {
    timer.startTimer();

    const product = await withTransaction(async (session) => {
      return productService.adjustInventory(req.params.productId, req.body, session);
    });

    const diffTime = timer.diffTimer();

    res.send({ res: product, time: diffTime });
  });
};
