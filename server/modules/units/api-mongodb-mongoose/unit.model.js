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

UnitSchema.static({
  async load(unitId, session) {
    const Unit = this;
    const unit = session ? await Unit.findById(unitId).session(session) : await Unit.findById(unitId);

    if (!unit) {
      throw new Error('Unit not found');
    }

    return unit;
  },
  async create(unit) {
    const Unit = this;
    const unitDoc = new Unit(unit);

    return unitDoc.save();
  },
});

module.exports = mongoose.model('Unit', UnitSchema);
