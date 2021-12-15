'use strict';

import { connection } from 'mongoose';
// { trainer: 'mastermind', team: [Pokemon1, P2, P_n]}

import request from 'supertest';
import { server } from '../src';
import { Team, User } from '../src/models';

import app from './../src/app';
import { testTeam, testUser } from './config';

const api = request(app);

let _testTeam = testTeam,
  _testUser = testUser;

beforeAll(async () => {
  const resAddUser = await api.post('/join/signup').send(_testUser);
  _testTeam.trainer = resAddUser.body.user.uid;
  // console.log('>>>1111', _testTeam);
});

afterEach(async () => {
  await User.findOneAndRemove({ email: testUser.email });
});

afterAll(async () => {
  await Team.findOneAndRemove({ trainer: _testTeam.trainer });

  connection.close();
  server.close();
});

describe('\n[TEAM]: Team Test Suite', () => {
  test('1. should return 201 status code and team created', async () => {
    const resLogin = await api.post('/join/login').send(_testUser);
    const { token } = resLogin.body;

    const resAddTeam = await api
      .put('/teams/pokemon')
      .set('Authorization', token)
      .send(_testTeam)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(resAddTeam.body.pokemonTeam.team).toEqual(_testTeam.team);

    const resGetTeam = await api
      .get('/teams')
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // console.log('>>> 222', resGetTeam.body, { _testTeam });
    expect(resGetTeam.body.trainer).toEqual(_testTeam.trainer);

    // Para Objs: toEqual()
    expect(resGetTeam.body.team).toEqual(_testTeam.team);
    // Para Values: toBe()
    expect(resGetTeam.body.team[0]).toBe(_testTeam.team[0]);
  });
});
