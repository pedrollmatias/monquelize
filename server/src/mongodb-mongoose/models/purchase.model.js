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
        unit: {
          unitRef: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          shortUnit: {
            type: String,
            required: true,
          },
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
    paymentMethod: {
      paymentMethodRef: {
        type: Schema.Types.ObjectId,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
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

purchaseSchema.method({
  ...purchaseSchema.method,
  async editProduct(product) {
    const purchase = this;
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.productRef.equals(product._id)) {
        purchaseProduct.sku = product.sku;
        purchaseProduct.name = product.name;
        purchaseProduct.category = (product.category && product.category._id) || undefined;
        purchaseProduct.unit = {
          unitRef: product.unit._id,
          shortUnit: product.unit.shortUnit,
        };
      }

      return purchaseProduct;
    });

    return purchase.edit({ products: purchaseProducts });
  },
  async removeProductRef(productId) {
    const purchase = this;
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.productRef.equals(productId)) {
        purchaseProduct.productRef = undefined;
      }

      return purchaseProduct;
    });

    return purchase.edit({ products: purchaseProducts });
  },
});

module.exports = mongoose.model('Purchase', purchaseSchema);
