'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Sequence = require('../../utils/sequence/sequence.model');

const saleStatusEnum = {
  '100': 'Draft',
  '200': 'Budget',
  '300': 'Done',
  '400': 'Canceled',
};

const opts = {
  collection: 'sales',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const SaleSchema = new Schema(
  {
    code: {
      type: Number,
      index: true,
      immutable: true,
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
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  opts
);

SaleSchema.virtual('totalValue').get(function () {
  const sale = this;

  return sale.products.reduce((totalValue, product) => (totalValue += product.amount * product.price), 0);
});

SaleSchema.pre('validate', async function () {
  const sale = this;
  const sequenceDoc = await Sequence.findById('sales');

  if (sequenceDoc) {
    const sequence = await Sequence.findByIdAndUpdate({ _id: 'sales' }, { $inc: { seq: 1 } }, { new: true });

    console.log(sequence);
    sale.code = sequence.seq;
  } else {
    const sequenceDoc = new Sequence({ _id: 'sales' });

    await sequenceDoc.save();
    sale.code = 1;
  }
});

SaleSchema.pre('remove', function () {
  const sale = this;

  if (['100', '200'].includes(sale.status)) {
    throw new Error('Only done or canceled sales can be removed');
  }
});

SaleSchema.static({
  async load(saleId, session) {
    const Sale = this;
    const sale = session ? await Sale.findById(saleId).session(session) : await Sale.findById(saleId);

    if (!sale) {
      throw new Error('Sale not found');
    }

    return sale;
  },
  async createSale(sale, session) {
    const Sale = this;
    const saleDoc = new Sale(sale);

    return saleDoc.save({ session });
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
