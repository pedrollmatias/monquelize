'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { mongooseModelMethodsFactory } = require('../../modules');

const opts = {
  collection: 'users',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
};

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      immutable: true,
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
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  opts
);

mongooseModelMethodsFactory.registerMethods(UserSchema);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);
