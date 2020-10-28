'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { mongooseModelMethodsFactory } = require('../../modules');

const historyEnum = {
  '100': 'Input',
  '200': 'Output',
  '300': 'Adjustment',
};

const opts = {
  collection: 'products',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const productSchema = new Schema(
  {
    sku: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
    },
    // disableInventoryChecks: {
    //   type: Boolean,
    //   default: false,
    // },
    currentAmount: {
      type: Number,
      required: true,
    },
    minAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    maxAmount: {
      type: Number,
    },
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        movementType: {
          type: String,
          required: true,
          enum: Object.keys(historyEnum),
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  opts
);

mongooseModelMethodsFactory.registerMethods(productSchema);

productSchema.pre('save', async function validateInventoryAmount() {
  const product = this;

  if (product.currentAmount < 0) {
    throw new Error('Quantity in inventory unavaliable');
  } else if (product.minAmount && product.currentAmount < product.minAmount) {
    throw new Error('A product can not have an amount less than the minimum allowed');
  }

  if (product.maxAmount && product.currentAmount > product.maxAmount) {
    throw new Error('A product can not have an amount greater than the maximum allowed');
  }

  if (product.minAmount && product.maxAmount && product.minAmount > product.maxAmount) {
    throw new Error('Minimum amount can not be greater than maximum amount');
  }
});

module.exports = mongoose.model('Product', productSchema);
