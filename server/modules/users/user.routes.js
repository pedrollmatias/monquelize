'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = (app, serverId) => {
  const dirPath = path.join(__dirname, `api-${serverId}`, 'user.api');
  const api = require(dirPath);

  app.use('/users', router);

  router.route('/').get(api.get);

  router.route('/create').post(api.create);

  router.param('userId', api.load);
  router.route('/:userId').get(api.query).post(api.edit).put(api.block);
};
