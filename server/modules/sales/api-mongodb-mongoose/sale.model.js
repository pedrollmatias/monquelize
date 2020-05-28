'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleStatusEnum = {
  '100': 'Draft',
  '200': 'Budget',
  '300': 'Done',
  '400': 'Canceled',
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
      paymentValue: {
        type: Number,
        required: true,
      },
    },
    seller: {
      type: Schema.Types.ObjectId,
    },
  },
  opts
);

SaleSchema.virtual('totalValue').get(function () {
  const sale = this;

  return sale.products.reduce((totalValue, product) => (totalValue += product.amount * product.salePrice), 0);
});

SaleSchema.static({
  async load(saleId, session) {
    const Sale = this;
    const sale = session ? await Sale.findById(saleId).session(session) : await Sale.findById(sale);

    if (!sale) {
      throw new Error('Sale not found');
    }

    return sale;
  },
  async create(sale, session) {
    const Sale = this;
    const saleDoc = new Sale(sale).session(session);

    return saleDoc.save();
  },
});

SaleSchema.method({
  async edit(data) {
    const sale = this;

    sale.overwrite(data);

    return sale.save();
  },
  async editFields(data) {
    const sale = this;

    for (const key of Object.keys(data)) {
      sale.set(key, data[key]);
    }

    return sale.save();
  },
});

module.exports = mongoose.model('Sale', SaleSchema);
