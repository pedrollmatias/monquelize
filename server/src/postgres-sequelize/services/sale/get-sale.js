'use strict';

const { Sale, Product, User, Unit, PaymentMethod } = require('../../models');

module.exports = async function getSale(saleId) {
  return Sale.findByPk(saleId, {
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
