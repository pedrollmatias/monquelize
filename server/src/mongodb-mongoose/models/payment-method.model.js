'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { mongooseModelMethodsFactory } = require('../../modules');

const paymentMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    acceptChange: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'paymentmethods' }
);

mongooseModelMethodsFactory.registerMethods(paymentMethodSchema);

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
