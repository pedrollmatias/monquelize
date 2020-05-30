'use strict';

const PaymentMethod = require('./payment-method.model');
const Sale = require('../../sales/api-mongodb-mongoose/sale.model');
const Purchase = require('../../purchases/api-mongodb-mongoose/purchase.model');

module.exports = {
  async load(req, res, next, paymentMethodId) {
    const paymentMethod = await PaymentMethod.findById(paymentMethodId);

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    req.paymentMethod = paymentMethod;
    next();
  },
  async get(req, res) {
    const query = req.query || {};
    const paymentMethod = await PaymentMethod.find(query);

    res.send(paymentMethod);
  },
  query(req, res) {
    res.send(req.paymentMethod);
  },
  async create(req, res) {
    const paymentMethod = await PaymentMethod.create(req.body);

    res.send(paymentMethod);
  },
  async edit(req, res) {
    const session = await PaymentMethod.startSession();

    session.startTransaction();
    try {
      // Update payment method
      const paymentMethod = await PaymentMethod.load(req.params.paymentMethodIdSession, session);
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
      res.send(updatedPaymentMethod);
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      throw err;
    }
  },
  async remove(req, res) {
    const session = await PaymentMethod.startSession();

    session.startTransaction();
    try {
      // Get payment method
      const paymentMethod = await PaymentMethod.load(req.params.paymentMethodIdSession, session);

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
      res.sendStatus(200);
    } catch (err) {
      await session.abortTransacttion();
      session.endSession();
      throw err;
    }
  },
};
