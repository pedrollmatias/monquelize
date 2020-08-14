'use strict';

const models = require('../../postgres-sequelize/models');

module.exports = async function syncModels(options) {
  for (const model of Object.keys(models)) {
    await models[model].sync(options);
  }
};
