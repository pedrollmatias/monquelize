'use strict';

const { Purchase, Product, User, Unit, PaymentMethod } = require('../../models');

module.exports = async function getPurchase(purchaseId) {
  return Purchase.findByPk(purchaseId, {
    include: [
      {
        model: Product,
        as: 'products',
        include: [
          {
            model: Unit,
            as: 'unit',
          },
        ],
      },
      {
        model: User,
      },
      {
        model: PaymentMethod,
        as: 'paymentMethod',
      },
    ],
  });
};
