'use strict';

const server = require('../src/server');
const axios = require('axios');

async function testWriteConflict() {
  await server();
  try {
    const reqs = [];

    for (let index = 0; index < 1; index++) {
      reqs.push(
        axios.post('http://localhost:9001/api/products/5f1b08e9f988b923a569f59e', {
          name: 'Produto 1',
        })
      );
    }

    await Promise.all(reqs);
  } catch (e) {}
}

testWriteConflict();
