'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = (app, serverId) => {
  const dirPath = path.join(__dirname, `api-${serverId}`, 'sale.api');
  const api = require(dirPath);

  app.use('/sales', router);

  router.route('/').get(api.get);

  router.route('/create').post(api.create);

  router.param('saleId', api.load);
  router.route('/:saleId').get(api.query);

  router.route('/:saleIdSession').post(api.edit).delete(api.remove);
};
