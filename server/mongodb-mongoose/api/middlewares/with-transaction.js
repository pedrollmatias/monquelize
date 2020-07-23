'use strict';

const mongoose = require('mongoose');

module.exports = async function withTransaction(fn) {
  const session = mongoose.startSession();

  session.startTransaction();

  try {
    const result = await fn(session);

    await session.commitTransaction(session);
    session.endSession();

    return result;
  } catch (err) {
    await session.abortTransaction(session);
    session.endSession();
    throw err;
  }
};
