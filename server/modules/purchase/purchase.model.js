'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseStatusEnum = {
  '100': 'draft',
  '300': 'done',
};

const PurchaseSchema = new Schema(
  {
    vendor: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.keys(purchaseStatusEnum),
      required: true,
      default: '100',
    },
    products: [
      {
        item: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    payment: {
      paymentMethod: {
        type: Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  },
  { collection: 'purchases' }
);

module.exports = mongoose.model('Purchase', PurchaseSchema);
