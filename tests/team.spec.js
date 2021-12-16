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

beforeEach(async () => {
  const resAddUser = await api.post('/join/signup').send(_testUser);
  _testTeam.trainer = resAddUser.body.user.uid;
  // console.log('>>>1111', _testTeam);
});

afterEach(async () => {
  await User.findOneAndRemove({ email: testUser.email });
  await Team.findOneAndRemove({ trainer: _testTeam.trainer });
});

afterAll(async () => {
  connection.close();
  server.close();
});

describe('\n[TEAM]: Team Test Suite', () => {
  test('1. should return the team of the given user', async () => {
    const resLogin = await api.post('/join/login').send(_testUser);
    const { token } = resLogin.body;

    const resAddTeam = await api
      .put('/teams/pokemon')
      .set('Authorization', token)
      .send(_testTeam)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(resAddTeam.body.pokemonTeam.team[0].name).toBe(_testTeam.teamArr[0]);

    const resGetTeam = await api
      .get('/teams')
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // console.log('>>> 222', { resGetTeam: resGetTeam.body }, { _testTeam });
    expect(resGetTeam.body.trainer).toEqual(_testTeam.trainer);
    expect(resGetTeam.body.team[1].pokedexNumber).toBe(25);

    const teamArray = resGetTeam.body.team;
    expect(teamArray.length).toBe(_testTeam.teamArr.length);

    teamArray.forEach(team => {
      const pokeName = team.name;

      expect(_testTeam.teamArr).toContain(pokeName);
      // // the expected array is a subset of the received array:
      // expect(received).toEqual(expect.arrayContaining(expected));
      // console.log(_testTeam.teamArr.includes(pokeName));
    });

    /* 
    // Para Objs: toEqual()
    expect(resGetTeam.body.team).toEqual(_testTeam.team);
    // Para Values: toBe()
    expect(resGetTeam.body.team[0]).toBe(_testTeam.team[0]); */
  });

  test('2. should remove the pokemon at index', async () => {
    const pokeId = 2;

    const resLogin = await api.post('/join/login').send(_testUser);
    const { token } = resLogin.body;

    await api
      .put('/teams/pokemon')
      .set('Authorization', token)
      .send(_testTeam)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const resGetTeam = await api
      .get('/teams')
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const teamArray = resGetTeam.body.team;
    // console.log('>>>> 222', { getTeam: resGetTeam.body.team.length });

    const res = await api
      .delete(`/teams/pokemon/${pokeId}`)
      .set('Authorization', token);

    expect(res.body.currentTeam.team.length).toBe(teamArray.length - 1);
  });
});
