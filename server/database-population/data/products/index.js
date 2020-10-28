'use strict';

const { appendSku } = require('../../utils');

const basicProducts = [
  ...require('./backpacks'),
  ...require('./papers-sheets-envelopes'),
  ...require('./school-suplies'),
  ...require('./peripherals'),
];

const completeProduct = [
  ...basicProducts,
  ...require('./books'),
  ...require('./media'),
  ...require('./musical-instruments'),
];

module.exports = {
  basic: appendSku(basicProducts),
  complete: appendSku(completeProduct),
};
