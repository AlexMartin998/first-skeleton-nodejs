import app from './../src/server';

import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

// Funciona con el type: module. But debo colocar  file.js en import

describe('\n[APP]: GET /tasks', () => {
  it('1. should return 200 status code', done => {
    chai
      .request(app)
      .get('/join/private')
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        done();
      });
  });
});
