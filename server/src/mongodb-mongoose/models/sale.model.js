'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sequenceModel = require('./sequence.model');
const { mongooseModelMethodsFactory } = require('../../modules');

const opts = {
  collection: 'sales',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const saleSchema = new Schema(
  {
    code: {
      type: Number,
      index: true,
      immutable: true,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        productRef: {
          type: Schema.Types.ObjectId,
        },
        sku: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        category: {
          type: Schema.Types.ObjectId,
        },
        unitRef: {
          type: Schema.Types.ObjectId,
        },
        shortUnit: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethodRef: {
      type: Schema.Types.ObjectId,
    },
    paymentMethodName: {
      type: String,
      required: true,
      trim: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  opts
);

mongooseModelMethodsFactory.registerMethods(saleSchema);

saleSchema.virtual('totalValue').get(function () {
  const sale = this;

  return sale.products.reduce((totalValue, product) => (totalValue += product.amount * product.price), 0);
});

saleSchema.pre('validate', async function () {
  const sale = this;
  const sequenceDoc = await sequenceModel.findById('sales');

  if (sequenceDoc) {
    const sequence = await sequenceModel.findByIdAndUpdate({ _id: 'sales' }, { $inc: { seq: 1 } }, { new: true });

    sale.code = sequence.seq;
  } else {
    const sequenceDoc = new sequenceModel({ _id: 'sales' });

    await sequenceDoc.save();
    sale.code = 1;
  }
});

module.exports = mongoose.model('Sale', saleSchema);
