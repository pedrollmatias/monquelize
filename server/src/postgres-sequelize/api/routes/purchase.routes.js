'use strict';

const express = require('express');
const router = express.Router();
const { purchaseService } = require('../../services');
const { timer } = require('../../../modules');
const { sequelize } = require('../../../loaders/databases/postgres-sequelize');

function normalizePurchase(purchase) {
  purchase.products = purchase.products.map((product) => ({
    productId: product.associatedIds.postgresSequelizeId,
    amount: product.amount,
    price: product.price,
  }));
  purchase.paymentMethodId = purchase.paymentMethod.associatedIds.postgresSequelizeId;
  Reflect.deleteProperty(purchase.paymentMethod);

  if (purchase.buyer) {
    purchase.buyerId = purchase.buyer.associatedIds.postgresSequelizeId;
    Reflect.deleteProperty(purchase.buyer);
  }

  return purchase;
}

module.exports = (app) => {
  app.use('/purchases', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      const query = { where: { date: { $between: [startDate, endDate] } } };

      const purchases = await purchaseService.get(query);

      const diffTime = timer.diffTimer();

      res.send({ res: purchases, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    const _purchase = normalizePurchase(req.body);

    timer.startTimer();
    const t = await sequelize.transaction();

    try {
      const purchase = await purchaseService.add(_purchase);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: purchase, time: diffTime });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  });

  router.get('/:purchaseId', async (req, res, next) => {
    try {
      timer.startTimer();

      const purchases = await purchaseService.query(req.params.purchaseId);

      const diffTime = timer.diffTimer();

      res.send({ res: purchases, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:purchaseId', async (req, res, next) => {
    const _purchase = normalizePurchase(req.body);

    try {
      timer.startTimer();

      const purchases = await purchaseService.edit(req.params.purchaseId, _purchase);

      const diffTime = timer.diffTimer();

      res.send({ res: purchases, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:purchaseId', async (req, res, next) => {
    timer.startTimer();

    const t = await sequelize.transaction();

    try {
      await purchaseService.remove(req.params.purchaseId);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  });
};
