'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseStatusEnum = {
  '100': 'Draft',
  '300': 'Done',
  '400': 'Canceled',
};

const opts = {
  collection: 'products',
  toJSON: { virtuals: true },
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
    buyer: {
      type: Schema.Types.ObjectId,
    },
  },
  opts
);

PurchaseSchema.virtual('totalValue').get(function () {
  const purchase = this;

  return purchase.products.reduce((totalValue, product) => (totalValue += product.amount * product.purchasePrice), 0);
});

PurchaseSchema.static({
  async load(purchaseId, session) {
    const Purchase = this;
    const purchase = session ? await Purchase.findById(purchaseId).session(session) : await Purchase.findById(purchase);

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    return purchase;
  },
  async create(purchase, session) {
    const Purchase = this;
    const purchaseDoc = new Purchase(purchase).session(session);

    return purchaseDoc.save();
  },
});

PurchaseSchema.method({
  async edit(data) {
    const purchase = this;

    purchase.overwrite(data);

    return purchase.save();
  },
  async editFields(data) {
    const purchase = this;

    for (const key of Object.keys(data)) {
      purchase.set(key, data[key]);
    }

    return purchase.save();
  },
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
