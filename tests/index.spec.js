'use strict';

import request from 'supertest';

import app from '../src/server.js';
const api = request(app);

describe('[ AUTH ]: Auth Test Suite', () => {
  const newUser = {
    name: 'Alex 33',
    email: 'test33@test.com',
    password: '123123',
  };

  describe('a) When all data is sent', () => {
    test('1. should return 401 when login data is missing', async () => {
      const resp = await api.get('/join/private').send(newUser);
      expect(resp.status).toBe(401);
    });
  });
});
