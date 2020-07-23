'use strict';

const express = require('express');
const router = express.Router();
const category = require('./categories/category.routes');
const paymentMethod = require('./payment-methods/payment-method.routes');
const product = require('./products/product.routes');
const purchase = require('./purchases/purchase.routes');
const sale = require('./sales/sale.routes');
const unit = require('./units/unit.routes');
const user = require('./users/user.routes');

module.exports = (serverId) => {
  const app = router;

  category(app, serverId);
  paymentMethod(app, serverId);
  product(app, serverId);
  purchase(app, serverId);
  sale(app, serverId);
  unit(app, serverId);
  user(app, serverId);

  return app;
};
