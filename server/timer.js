'use strict';

const utils = require('./utils');

let time;

module.exports = {
  getTime() {
    return time;
  },
  startTimer() {
    time = process.hrtime();
  },
  diffTimer() {
    return utils.getExecutionTimeInMs(process.hrtime(time));
  },
};
