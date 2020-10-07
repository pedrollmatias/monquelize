'use strict';

const { User } = require('../../models');

module.exports = async function editUser(userId, user) {
  let [, updatedUser] = await User.update(user, {
    where: { _id: userId },
    returning: true,
    plain: true,
  });

  updatedUser = updatedUser.dataValues;

  return updatedUser;
};
