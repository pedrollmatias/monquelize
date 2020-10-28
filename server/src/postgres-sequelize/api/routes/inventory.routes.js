'use strict';

const express = require('express');
const router = express.Router();
const { inventoryService } = require('../../services');
const { timer } = require('../../../modules');
const { sequelize } = require('../../../loaders/databases/postgres-sequelize');

module.exports = (app) => {
  app.use('/inventory', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const inventory = await inventoryService.get(req.query);

      const diffTime = timer.diffTimer();

      res.send({ res: inventory, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      const inventory = await inventoryService.query(req.params.productId);

      const diffTime = timer.diffTimer();

      res.send({ res: inventory, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add-inventory-movement/:productId', async (req, res, next) => {
    timer.startTimer();
    const t = await sequelize.transaction();

    try {
      const inventory = await inventoryService.addInventoryMovement(req.params.productId, req.body);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: inventory, time: diffTime });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  });

  router.post('/adjust-product-inventory/:productId', async (req, res, next) => {
    timer.startTimer();
    const t = await sequelize.transaction();

    try {
      const inventory = await inventoryService.adjustProductInventory(req.params.productId, req.body);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: inventory, time: diffTime });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  });
};
