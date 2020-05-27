'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../modules');
const config = require('../config');

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
  app.use(config.api.prefix, routes(serverId));

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;
    next(err);
  });

  // Error handlers
  app.use((err, req, res, next) => {
    // Handle 401 thrown by express-jwt library
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }

    return next(err);
  });
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({ errors: { message: err.message } });
  });
};
