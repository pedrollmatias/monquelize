'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 1,
    },
  },
  {
    collection: 'sequence',
  }
);

module.exports = mongoose.model('Sequence', sequenceSchema);
