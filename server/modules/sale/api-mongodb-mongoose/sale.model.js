'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleStatusEnum = {
  '100': 'draft',
  '200': 'budget',
  '300': 'done',
};

const opts = {
  collection: 'sales',
  toJSON: { virtuals: true },
};

const SaleSchema = new Schema(
  {
    customer: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.keys(saleStatusEnum),
      required: true,
      default: '100',
    },
    products: [
      {
        item: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
          min: 0,
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
  opts
);

SaleSchema.method({
  async edit(data) {
    this.overwrite(data);

    return this;
  },
});

module.exports = mongoose.model('Sale', SaleSchema);
