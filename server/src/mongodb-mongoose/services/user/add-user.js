'use strict';

const { userModel } = require('../../models');

module.exports = function addUser(data) {
  return userModel.add(data);
};
