'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.static({
  async load(userId, session) {
    const User = this;
    const user = session ? await User.findById(userId).session(session) : await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
  async create(unit) {
    const User = this;
    const user = new User(unit);

    return user.save();
  },
});

UserSchema.method({
  async edit(data) {
    const user = this;

    user.overwrite(data);

    return user.save();
  },
  async editFields(data) {
    const user = this;

    for (const key of Object.keys(data)) {
      user.set(key, data[key]);
    }

    return user.save();
  },
});

module.exports = mongoose.model('User', UserSchema);
