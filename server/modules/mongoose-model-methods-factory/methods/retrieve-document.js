'use strict';

module.exports = async function retrieve(model, documentId, session) {
  const document = session ? await model.findById(documentId).session(session) : await model.findById(documentId);

  if (!document) {
    const modelName = new model({}).instance.modelName;

    throw new Error(`${modelName}: Document not found`);
  }

  return document;
};
