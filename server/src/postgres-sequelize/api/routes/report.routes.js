'use strict';

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { reportService } = require('../../services');
const { timer } = require('../../../modules');

function castToObjectIdArray(obj) {
  const array = Array.isArray(obj) ? obj : [obj];

  return array.map((element) => mongoose.Types.ObjectId(element));
}

module.exports = (app) => {
  app.use('/reports', router);

  router.get('/get-sales-amount-total-by-date-range', async (req, res, next) => {
    try {
      timer.startTimer();

      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      const query = { startDate, endDate };

      const salesReport = await reportService.getSalesAmountTotalByDateRange(query);

      const diffTime = timer.diffTimer();

      res.send({ res: salesReport, time: diffTime });
    } catch (err) {
      next(err);
    }
  });

  //   router.get('/get-sales-by-category-by-date-range', async (req, res, next) => {
  //     try {
  //       timer.startTimer();

  //       const startDate = new Date(req.query.startDate);
  //       const endDate = new Date(req.query.endDate);
  //       const query = { date: { $gte: startDate, $lte: endDate } };

  //       const salesReport = await reportService.getSalesByCategoryByDateRange(query);

  //       const diffTime = timer.diffTimer();

  //       res.send({ res: salesReport, time: diffTime });
  //     } catch (err) {
  //       next(err);
  //     }
  //   });

  //   router.get('/get-advanced-sales-report', async (req, res, next) => {
  //     try {
  //       timer.startTimer();
  //       let query = {};

  //       const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
  //       const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;

  //       if (startDate && endDate) {
  //         query = { ...query, date: { $gte: startDate, $lte: endDate } };
  //       } else if (startDate) {
  //         query = { ...query, date: { $gte: startDate } };
  //       } else if (endDate) {
  //         query = { ...query, date: { $lte: endDate } };
  //       }

  //       if (req.query.categories) {
  //         query = { ...query, 'products.category': { $in: castToObjectIdArray(req.query.categories) } };
  //       }
  //       if (req.query.products) {
  //         query = { ...query, 'products._id': { $in: castToObjectIdArray(req.query.products) } };
  //       }
  //       if (req.query.units) {
  //         query = { ...query, 'products.unit.unitRef': { $in: castToObjectIdArray(req.query.units) } };
  //       }
  //       if (req.query.paymentMethods) {
  //         query = {
  //           ...query,
  //           'products.paymentMethod.paymentMethodRef': { $in: castToObjectIdArray(req.query.paymentMethods) },
  //         };
  //       }
  //       if (req.query.sellers) {
  //         query = { ...query, seller: { $in: castToObjectIdArray(req.query.sellers) } };
  //       }

  //       const salesReport = await reportService.getAdvancesSalesReport(query);
  //       const diffTime = timer.diffTimer();

  //       res.send({ res: salesReport, time: diffTime });
  //     } catch (err) {
  //       next(err);
  //     }
  //   });
};
