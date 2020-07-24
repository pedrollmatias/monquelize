'use strict';

const { createDocument, retriveDocument, updateDocument, deleteDocument, getDocuments } = require('./methods');

module.exports = function registerMethods(schema) {
  schema.static({
    ...schema.static,
    get(query, session) {
      return getDocuments(this, query, session);
    },
    retrieve(docId, session) {
      return retriveDocument(this, docId, session);
    },
    add(data) {
      return createDocument(this, data);
    },
  });

  schema.method({
    ...schema.method,
    edit(data) {
      return updateDocument(this, data);
    },
    delete() {
      return deleteDocument(this);
    },
  });
};
