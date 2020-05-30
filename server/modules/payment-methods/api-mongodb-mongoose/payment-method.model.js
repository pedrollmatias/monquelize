'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    acceptChange: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'paymentmethods' }
);

PaymentMethodSchema.static({
  async load(paymentMethodId, session) {
    const PaymentMethod = this;
    const category = session
      ? await PaymentMethod.findById(paymentMethodId).session(session)
      : await PaymentMethod.findById(paymentMethodId);

    if (!category) {
      throw new Error('Payment method not found');
    }

    return category;
  },
  async create(paymentMethod) {
    const PaymentMethod = this;
    const paymentMethodDoc = new PaymentMethod(paymentMethod);

    return paymentMethodDoc.save();
  },
});

PaymentMethodSchema.method({
  async editFields(data) {
    const paymentMethod = this;

    for (const key of Object.keys(data)) {
      paymentMethod.set(key, data[key]);
    }

    return paymentMethod.save();
  },
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
