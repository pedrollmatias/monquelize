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
  },
  { collection: 'products' }
);

ProductSchema.pre('save', async function validateInventoryAmount() {
  const product = this;
  const currentAmount = product.inventory && product.inventory.currentAmount;
  const minAmount = product.inventory && product.inventory.minAmount;
  const maxAmount = product.inventory && product.inventory.maxAmount;

  if (currentAmount < 0) {
    throw new Error('Quantity in inventory unavaliable');
  } else if (minAmount && currentAmount < minAmount) {
    throw new Error('A product can not have an amount less than the minimum allowed');
  }

  if (maxAmount && currentAmount > maxAmount) {
    throw new Error('A product can not have an amount greater than the maximum allowed');
  }

  if (minAmount && maxAmount && minAmount > maxAmount) {
    throw new Error('Minimum amount can not be greater than maximum amount');
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
  async create(product) {
    const Product = this;
    const productDoc = new Product(product);

    return productDoc.save();
  },
});

ProductSchema.method({
  async editFields(data) {
    const product = this;

    for (const key of Object.keys(data)) {
      product.set(key, data[key]);
    }

    return product.save();
  },
});

module.exports = mongoose.model('Product', ProductSchema);
