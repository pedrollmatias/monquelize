'use strict';

const { User } = require('../../models');

module.exports = function addUser(user) {
  return User.create(user);
};
