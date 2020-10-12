'use strict';

module.exports = {
  category: require('./category.routes'),
  inventory: require('./inventory.routes'),
  paymentMethod: require('./payment-method.routes'),
  product: require('./product.routes'),
  purchase: require('./purchase.routes'),
  report: require('./report.routes'),
  sale: require('./sale.routes'),
  unit: require('./unit.routes'),
  user: require('./user.routes'),
};
