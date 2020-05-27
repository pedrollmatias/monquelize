'use strict';

const express = require('express');
const router = express.Router();
const user = require('./user/user.routes');
const product = require('./product/product.routes');

module.exports = (serverId) => {
  const app = router;

  user(app, serverId);
  product(app, serverId);

  return app;
};
