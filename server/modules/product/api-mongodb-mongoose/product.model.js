'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historyEnum = {
  '100': 'Input',
  '200': 'Output',
};

const ProductSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
    },
    unit: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
    },
    inventory: {
      currentAmount: {
        type: Number,
        required: true,
        default: 0,
      },
      minAmount: {
        type: Number,
        required: true,
        default: 0,
      },
      maxAmount: {
        type: Number,
        required: true,
      },
    },
    history: [
      {
        date: {
          type: Date,
        },
        movementType: {
          type: String,
          enum: Object.keys(historyEnum),
        },
      },
    ],
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'products' }
);

ProductSchema.method({
  async edit(data) {
    this.overwrite(data);

    return this;
  },
});

module.exports = mongoose.model('Product', ProductSchema);
