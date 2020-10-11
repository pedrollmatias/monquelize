'use strict';

module.exports = {
  category: require('./category.routes'),
  paymentMethods: require('./payment-method.routes'),
  product: require('./product.routes'),
  purchase: require('./purchase.routes'),
  sales: require('./sale.routes'),
  unit: require('./unit.routes'),
  user: require('./user.routes'),
};
