'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = (app, serverId) => {
  const dirPath = path.join(__dirname, `api-${serverId}`, 'category.api');
  const api = require(dirPath);

  app.use('/categories', router);

  router.route('/').get(api.get);

  router.route('/create').post(api.create);

  router.route('/:categoryId').get(api.query).post(api.edit).delete(api.remove);
};
