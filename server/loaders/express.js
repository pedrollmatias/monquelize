'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const { routeRegister } = require('../modules');
const config = require('../config');
const Logger = require('./logger');
const timer = require('../timer');

module.exports = (app, serverId) => {
  // Health Check endpoints
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');
  app.use(cors());
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    Logger.info(`Request URL: ${req.originalUrl}`);
    next();
  });

  app.use(config.api.prefix, routeRegister(serverId));

  // /// catch 404 and forward to error handler
  // app.use((req, res, next) => {
  //   const err = new Error('Not Found');

  //   err.status = 404;
  //   next(err);
  // });

  app.use((err, req, res, next) => {
    Logger.error(err.stack);
    res.status(err.status || 500).send({
      message: err.message,
      time: timer.diffTimer(),
    });
  });
};
