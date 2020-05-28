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

ProductSchema.pre('save', async function validateInventoryAmount() {
  const product = this;
  const currentInventoryAmount = product.inventory && product.inventory.currentAmount;

  if (currentInventoryAmount < 0) {
    throw new Error('Quantity in inventory unavaliable');
  } else if (currentInventoryAmount < (product.inventory && product.inventory.minAmount)) {
    throw new Error('A product can not have an amount less than the minimum allowed');
  }

  if (currentInventoryAmount > (product.inventory && product.inventory.maxAmount)) {
    throw new Error('A product can not have an amount greater than the maximum allowed');
  }
});

ProductSchema.static({
  async load(productId, session) {
    const Product = this;
    const product = session ? await Product.findById(productId).session(session) : await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },
});

ProductSchema.method({
  async edit(data) {
    const product = this;

    product.overwrite(data);

    return product;
  },
  async editFields(data) {
    const product = this;

    for (const key of Object.keys(data)) {
      product.set(key, data[key]);
    }

    return product.save();
  },
});

module.exports = mongoose.model('Product', ProductSchema);
