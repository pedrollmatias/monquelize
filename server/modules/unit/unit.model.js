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

module.exports = mongoose.model('Unit', UnitSchema);
