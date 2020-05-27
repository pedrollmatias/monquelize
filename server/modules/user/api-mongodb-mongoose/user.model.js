'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    bornDate: {
      type: Date,
      required: true,
    },
  },
  { collection: 'users' }
);

module.exports = mongoose.model('User', UserSchema);
