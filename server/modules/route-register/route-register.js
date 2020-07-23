'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = function registerRoute(serverId) {
  const app = router;
  const routesPath = path.join(__dirname, '../../', serverId, 'api/routes');
  const routes = require(routesPath);

  for (const route of Object.keys(routes)) {
    routes[route](app, serverId);
  }

  return app;
};
