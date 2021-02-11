'use strict';

const paymentMethods = [
  {
    name: 'Débito',
    acceptChange: false,
  },
  {
    name: 'Crédito',
    acceptChange: false,
  },
  {
    name: 'Dinheiro',
    acceptChange: true,
  },
];

module.exports = paymentMethods;
