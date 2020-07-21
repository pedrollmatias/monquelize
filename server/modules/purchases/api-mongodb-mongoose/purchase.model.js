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
  toObject: { virtuals: true },
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
        costPrice: {
          type: Number,
          required: true,
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

    return purchase.editFields({ products: purchaseProducts });
  },
  async removeProductRef(productId) {
    const purchase = this;
    const purchaseProducts = purchase.products.map((purchaseProduct) => {
      if (purchaseProduct.productRef.equals(productId)) {
        purchaseProduct.productRef = undefined;
      }

      return purchaseProduct;
    });

    return purchase.editFields({ products: purchaseProducts });
  },
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
