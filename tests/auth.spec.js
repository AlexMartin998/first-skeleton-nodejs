'use strict';

import { connection } from 'mongoose';
import request from 'supertest';

import app from '../src/app';
import { server } from '../src/';
import { testUser } from './config';
import { User } from '../src/models/';

const api = request(app);
let _testUser = testUser;

beforeEach(async () => {
  const user = await api.post('/join/signup').send(_testUser);

  testUser.trainer = user.id;
});

afterEach(async () => {
  await User.findOneAndRemove({ email: _testUser.email });
});

afterAll(async () => {
  connection.close();
  server.close();
});

describe('\n[ AUTH ]: Auth Test Suite', () => {
  describe('a) When all data is sent', () => {
    test.skip('1. should return 201 when registering a New User', async () => {
      await api
        .post('/join/signup')
        .send({
          name: 'Alex 54',
          email: 'test54@test.com',
          password: '123123',
        })
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });
    test('2. should return a json with a valid token for succesful login', async () => {
      const resp = await api
        .post('/join/login')
        .send(testUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(resp.body.token).toBeDefined();
    });
    test('3. should return 200 when jwt is valid', async () => {
      const resp = await api.post('/join/login').send(_testUser).expect(200);
      const { token } = resp.body;

      await api.get('/join/private').set('Authorization', token).expect(200);
    });
  });

  describe('b) When data are missing', () => {
    test('1. should return 401 when token is missing', async () => {
      await api.get('/join/private').expect(401);
    });
    test('2. should return 400 when log in data are missing', async () => {
      const fields = [
        {},
        { email: _testUser.email },
        { password: _testUser.password },
        { someData: 'Some data' },
        { email: _testUser.email, password: 'no-password' },
        { email: 'test333@test.com', password: _testUser.password },
      ];

      // This works sequentially with a for-of loop
      for (const body of fields) {
        await api.post('/join/login').send(body).expect(400);
      }
    });
  });
});
