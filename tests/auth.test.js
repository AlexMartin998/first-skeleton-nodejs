'use strict';

import { after, describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from './../src/server';
import { User } from '../src/models';

chai.use(chaiHttp);

describe('[ AUTH ]: Auth Test Suite', () => {
  const newUser = {
    name: 'Alex 33',
    email: 'test33@test.com',
    password: '123123',
  };

  describe('a) When all data is sent', () => {
    it('1. should return 201 when registering a New User', done => {
      chai
        .request(app)
        .post('/join/signup')
        .set('content-type', 'application/json')
        .send(newUser)
        .end((err, res) => {
          chai.assert.equal(res.status, 201);
          done();
        });
    });
    it('2. should return 200 and token for succesful login', done => {
      chai
        .request(app)
        .post('/join/login')
        .set('content-type', 'application/json')
        .send(newUser)
        .end((err, res) => {
          // Expect valid login
          chai.assert.equal(res.status, 200);
          done();
        });
    });
    it('3. should return 200 when jwt is valid', done => {
      chai
        .request(app)
        .post('/join/login')
        .set('content-type', 'application/json')
        .send(newUser)
        .end((err, res) => {
          // Expect valid login
          // console.log('>>>>> RESPONSE LOGIN:  ', res.body.token, res.status);
          chai.assert.equal(res.status, 200);

          chai
            .request(app)
            .get('/join/private')
            .set('Authorization', `${res.body.token}`)
            .end((err, res) => {
              chai.assert.equal(res.status, 200);
              done();
            });
        });
    });
  });

  describe('b) When data are missing', () => {
    it('1. should return 400 when log in data are missing', done => {
      chai
        .request(app)
        .post('/join/login')
        .set('content-type', 'application/json')
        .send({ email: newUser.email })
        .end((err, res) => {
          chai.assert.equal(res.status, 400);
          done();
        });
    });
    it('2. should return 401 when no jwt token is available', done => {
      chai
        .request(app)
        .get('/join/private')
        .end((err, res) => {
          chai.assert.equal(res.status, 401);
          done();
        });
    });
  });
});

after(async () => {
  await User.findOneAndDelete({ email: 'test33@test.com' });
});
