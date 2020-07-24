'use strict';

module.exports = {
  category: require('./category.routes'),
  paymentMethod: require('./payment-method.routes'),
  product: require('./product.routes'),
  purchase: require('./purchase.routes'),
  sale: require('./sale.routes'),
  unit: require('./unit.routes'),
  user: require('./user.routes'),
};
