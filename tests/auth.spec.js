'use strict';

import { connection } from 'mongoose';
import request from 'supertest';

import app from '../src/server.js';
import { server } from '../src/app.js';
import { User } from '../src/models/';

const api = request(app);

describe('\n[ AUTH ]: Auth Test Suite', () => {
  const newUser = {
    name: 'Alex 33',
    email: 'test33@test.com',
    password: '123123',
  };

  describe('a) When all data is sent', () => {
    test('1. should return 201 when registering a New User', async () => {
      await api
        .post('/join/signup')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });
    test('2. should return a json with a valid token for succesful login', async () => {
      const resp = await api
        .post('/join/login')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(resp.body.token).toBeDefined();
    });
    test('3. should return 200 when jwt is valid', async () => {
      const resp = await api.post('/join/login').send(newUser).expect(200);
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
        { email: 'test33@test.com' },
        { password: '123123' },
        { someData: 'Some data' },
        { email: 'test33@test.com', password: 'no-password' },
        { email: 'test333@test.com', password: '123123' },
      ];

      // This works sequentially with a for-of loop
      for (const body of fields) {
        await api.post('/join/login').send(body).expect(400);
      }
    });
  });
});

afterAll(async () => {
  await User.findOneAndRemove({ email: 'test33@test.com' });

  connection.close();
  server.close();
});
