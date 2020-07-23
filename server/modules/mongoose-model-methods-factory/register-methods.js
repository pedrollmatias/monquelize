'use strict';

const { createDocument, retriveDocument, updateDocument, deleteDocument, getDocuments } = require('./methods');

module.exports = function registerMethods(schema) {
  schema.static.create = (data) => createDocument(this, data);
  schema.static.retrive = (docId, session) => retriveDocument(this, docId, session);
  schema.method.update = (data) => updateDocument(this, data);
  schema.method.delete = () => deleteDocument(this);
  schema.static.get = (query, session) => getDocuments(this, query, session);
};
