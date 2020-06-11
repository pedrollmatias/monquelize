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
    payment: {
      paymentMethodRef: {
        type: Schema.Types.ObjectId,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      value: {
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
  async editProduct(product) {
    const sale = this;
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.productRef.equals(product._id)) {
        saleProduct.sku = product.sku;
        saleProduct.name = product.name;
        saleProduct.category = (product.category && product.category._id) || undefined;
        saleProduct.unit = {
          unitRef: product.unit._id,
          shortUnit: product.unit.shortUnit,
        };
      }

      return saleProduct;
    });

    return sale.editFields({ products: saleProducts });
  },
  async removeProductRef(productId) {
    const sale = this;
    const saleProducts = sale.products.map((saleProduct) => {
      if (saleProduct.productRef.equals(productId)) {
        saleProduct.productRef = undefined;
      }

      return saleProduct;
    });

    return sale.editFields({ products: saleProducts });
  },
});

module.exports = mongoose.model('Sale', SaleSchema);
