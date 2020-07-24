'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SequenceSchema = new Schema(
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

module.exports = mongoose.model('Sequence', SequenceSchema);
