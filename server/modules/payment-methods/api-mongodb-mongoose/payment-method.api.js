'use strict';

const PaymentMethod = require('./payment-method.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');
const utils = require('../../../utils');

module.exports = {
  async get(req, res, next) {
    try {
      const startTime = process.hrtime();
      const query = req.query || {};
      const paymentMethod = await PaymentMethod.find(query);
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: paymentMethod, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async query(req, res, next) {
    try {
      const startTime = process.hrtime();
      const paymentMethod = await PaymentMethod.load(req.params.paymentMethodId);

      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: paymentMethod, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    const startTime = process.hrtime();

    try {
      const paymentMethod = await PaymentMethod.create(req.body);
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: paymentMethod, time: diffTime });
    } catch (err) {
      next(err);
    }
  },
  async edit(req, res, next) {
    const startTime = process.hrtime();
    const session = await PaymentMethod.startSession();

    session.startTransaction();
    try {
      // Update payment method
      const paymentMethod = await PaymentMethod.load(req.params.paymentMethodId, session);
      const updatedPaymentMethod = await paymentMethod.editFields(req.body);

      // Update payment method in sales and purchases if name was modified
      if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
        const query = { 'payment.paymentMethodRef': updatedPaymentMethod._id };
        const sales = await Sale.find(query);
        const purchases = await Purchase.find(query);

        for (const sale in sales) {
          const salePayment = sale.payment;

          salePayment.name = updatedPaymentMethod;

          await sale.editFields({ payment: salePayment });
        }

        for (const purchase in purchases) {
          const purchasePayment = purchase.payment;

          purchasePayment.name = updatedPaymentMethod;

          await purchase.editFields({ payment: purchasePayment });
        }
      }

      await session.commitTransaction();
      session.endSession();
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: updatedPaymentMethod, time: diffTime });
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      next(err);
    }
  },
  async remove(req, res, next) {
    const startTime = process.hrtime();
    const session = await PaymentMethod.startSession();

    session.startTransaction();
    try {
      // Get payment method
      const paymentMethod = await PaymentMethod.load(req.params.paymentMethodId, session);

      // Remove payment method ref in sales and purchases
      const query = { 'payment.paymentMethodRef': paymentMethod._id };
      const sales = await Sale.find(query);
      const purchases = await Purchase.find(query);

      for (const sale in sales) {
        const salePayment = sale.payment;

        salePayment.paymentMethodRef = undefined;

        await sale.editFields({ payment: salePayment });
      }

      for (const purchase in purchases) {
        const purchasePayment = purchase.payment;

        purchasePayment.paymentMethodRef = undefined;

        await purchase.editFields({ payment: purchasePayment });
      }

      // Remove payment
      await paymentMethod.remove();

      await session.commitTransaction();
      session.endSession();
      const diffTime = utils.getExecutionTimeInMs(process.hrtime(startTime));

      res.send({ res: { status: 200 }, time: diffTime });
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      next(err);
    }
  },
};
