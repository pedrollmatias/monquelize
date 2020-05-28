'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema(
  {
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    shortUnit: {
      type: String,
      required: true,
      trim: true,
    },
    decimalPlaces: {
      type: Number,
    },
  },
  { collection: 'units' }
);

UnitSchema.pre('remove', async function preventRemoveFromRelatedProduct() {
  const unit = this;
  const Product = mongoose.model('Product');
  const relatedProducts = await Product.find({ unit: unit._id });

  if (relatedProducts.length) {
    throw new Error('Can not remove units which has related products. Remove the unit from related products first.');
  }
});

module.exports = mongoose.model('Unit', UnitSchema);
