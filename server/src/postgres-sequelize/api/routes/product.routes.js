'use strict';

const express = require('express');
const router = express.Router();
const { productService } = require('../../services');
const { timer } = require('../../../modules');
const sequelize = require('../../../loaders/databases/postgres-sequelize');

function normalizeProductBody(product) {
  const _product = { ...product, ...product.inventory };

  _product.costPrice = _product.costPrice === '' ? null : _product.costPrice;

  if (_product.category) {
    _product.categoryId = _product.category.associatedIds.postgresSequelizeId;
    Reflect.deleteProperty(_product, 'category');
  } else {
    _product.categoryId = null;
  }

  if (_product.unit) {
    _product.unitId = _product.unit.associatedIds.postgresSequelizeId;
    Reflect.deleteProperty(_product, 'unit');
  } else {
    _product.unitId = null;
  }

  return _product;
}

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
    const _product = normalizeProductBody(req.body);

    timer.startTimer();
    const t = await sequelize.transaction();

    try {
      const product = await productService.add(_product);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: product, time: diffTime });
    } catch (err) {
      await t.rollback();

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
    const _product = normalizeProductBody(req.body);

    try {
      timer.startTimer();

      const products = await productService.edit(req.params.productId, _product);

      const diffTime = timer.diffTimer();

      res.send({ res: products, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      productService.remove(req.params.productId);

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:productId/inventory', async (req, res, next) => {
    try {
      timer.startTimer();

      const product = await await productService.getInventory(req.params.productId);

      const diffTime = timer.diffTimer();

      res.send({ res: product, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
