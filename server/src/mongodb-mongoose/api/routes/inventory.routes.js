'use strict';

const express = require('express');
const router = express.Router();
const { inventoryService } = require('../../services');
const { timer } = require('../../../modules');

module.exports = (app) => {
  app.use('/inventory', router);

  router.post('/add-inventory-movement/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      const inventory = await inventoryService.addInventoryMovement(req.params.productId, req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: inventory, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/adjust-product-inventory/:productId', async (req, res, next) => {
    try {
      timer.startTimer();

      const inventory = await inventoryService.adjustProductInventory(req.params.productId, req.body);

      const diffTime = timer.diffTimer();

      res.send({ res: inventory, time: diffTime });
    } catch (err) {
      next(err);
    }
  });
};
