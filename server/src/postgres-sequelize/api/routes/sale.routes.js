'use strict';

const express = require('express');
const router = express.Router();
const { saleService } = require('../../services');
const { timer } = require('../../../modules');
const { sequelize } = require('../../../loaders/databases/postgres-sequelize');

function normalizeSale(sale) {
  sale.products = sale.products.map((product) => ({
    productId: product.associatedIds.postgresSequelizeId,
    amount: product.amount,
    price: product.price,
  }));
  sale.paymentMethodId = sale.paymentMethod.associatedIds.postgresSequelizeId;
  Reflect.deleteProperty(sale.paymentMethod);

  if (sale.seller) {
    sale.sellerId = sale.seller.associatedIds.postgresSequelizeId;
    Reflect.deleteProperty(sale.seller);
  }

  return sale;
}

module.exports = (app) => {
  app.use('/sales', router);

  router.get('/', async (req, res, next) => {
    try {
      timer.startTimer();

      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      const query = { where: { date: { $between: [startDate, endDate] } } };

      const sales = await saleService.get(query);

      const diffTime = timer.diffTimer();

      res.send({ res: sales, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/add', async (req, res, next) => {
    const _sale = normalizeSale(req.body);

    timer.startTimer();
    const t = await sequelize.transaction();

    try {
      const sale = await saleService.add(_sale);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: sale, time: diffTime });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  });

  router.get('/:saleId', async (req, res, next) => {
    try {
      timer.startTimer();

      const sales = await saleService.query(req.params.saleId);

      const diffTime = timer.diffTimer();

      res.send({ res: sales, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:saleId', async (req, res, next) => {
    const _sale = normalizeSale(req.body);

    timer.startTimer();
    const t = await sequelize.transaction();

    try {
      const sales = await saleService.edit(req.params.saleId, _sale);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: sales, time: diffTime });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  });

  router.delete('/:saleId', async (req, res, next) => {
    timer.startTimer();

    const t = await sequelize.transaction();

    try {
      await saleService.remove(req.params.saleId);

      await t.commit();

      const diffTime = timer.diffTimer();

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  });
};
