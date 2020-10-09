'use strict';

const { User } = require('../../models');

module.exports = async function getUser() {
  return User.findAll();
};
