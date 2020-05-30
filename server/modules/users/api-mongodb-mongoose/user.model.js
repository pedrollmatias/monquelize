'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  { collection: 'users' }
);

UserSchema.static({
  async create(unit) {
    const User = this;
    const user = new User(unit);

    return user.save();
  },
});

UserSchema.method({
  async editFields(data) {
    const user = this;

    for (const key of Object.keys(data)) {
      user.set(key, data[key]);
    }

    return user.save();
  },
});

module.exports = mongoose.model('User', UserSchema);
