'use strict';

const express = require('express');
const path = require('path');

module.exports = function registerRoute(serverId) {
  const router = express.Router();
  const routesPath = path.join(__dirname, '../../', serverId, 'api/routes');
  const routes = require(routesPath);

  for (const route of Object.keys(routes)) {
    routes[route](router);
  }

  return router;
};
