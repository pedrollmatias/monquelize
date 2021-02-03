'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sequenceModel = require('./sequence.model');
const { mongooseModelMethodsFactory } = require('../../modules');

const opts = {
  collection: 'purchases',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const purchaseSchema = new Schema(
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
    vendor: {
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
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  opts
);

mongooseModelMethodsFactory.registerMethods(purchaseSchema);

purchaseSchema.virtual('totalValue').get(function () {
  const purchase = this;

  return purchase.products.reduce((totalValue, product) => (totalValue += product.amount * product.price), 0);
});

purchaseSchema.pre('validate', async function () {
  const purchase = this;
  const sequenceDoc = await sequenceModel.findById('purchases');

  if (sequenceDoc) {
    const sequence = await sequenceModel.findByIdAndUpdate({ _id: 'purchases' }, { $inc: { seq: 1 } }, { new: true });

    purchase.code = sequence.seq;
  } else {
    const sequenceDoc = new sequenceModel({ _id: 'purchases' });

    await sequenceDoc.save();
    purchase.code = 1;
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
