'use strict';

const express = require('express');
const cors = require('cors');
const { routeRegister, timer } = require('../modules');
const config = require('../config');
const Logger = require('./logger');

module.exports = (app, serverId) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    Logger.info(`Request URL: ${fullUrl}`);
    next();
  });

  app.use(config.api.prefix, routeRegister(serverId));

  app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    Logger.error(err.stack);
    res.status(err.status || 500).send({
      message: err.message,
      time: timer.diffTimer(),
    });
  });
};
