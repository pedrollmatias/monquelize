'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = (app, serverId) => {
  const dirPath = path.join(__dirname, `api-${serverId}`, 'unit.api');
  const api = require(dirPath);

  app.use('/units', router);

  router.route('/').get(api.get);

  router.route('/create').post(api.create);

  router.param('unitId', api.load);
  router.route('/:unitId').get(api.query).post(api.edit).delete(api.remove);
};
