'use strict';

const { User } = require('../../models');
const getUser = require('./get-user');

module.exports = async function toggleBlock(userId) {
  const user = await getUser(userId);

  return User.update(
    { blocked: !user.blocked },
    {
      where: { _id: userId },
    }
  );
};
