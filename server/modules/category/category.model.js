'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentCategory: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: 'categories' }
);

module.exports = mongoose.model('Product', CategorySchema);
