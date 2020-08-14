'use strict';

const express = require('express');
const router = express.Router();
const { productService } = require('../../services');
const { timer } = require('../../../modules');

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
};
