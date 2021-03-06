'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import {
  addPokemonToTeam,
  deletePokemonFromTeam,
  getTeamFromUser,
} from '../controllers';
import { validateFields } from '../middlewares';

const router = Router();

router.route('/').get(getTeamFromUser);

router.route('/pokemon').put(
  [
    check('teamArr', 'Invalid team!').isArray().notEmpty(),
    check('trainer', 'Invalid trainer!').isMongoId(),
    validateFields,
  ],

  addPokemonToTeam
);

router.route('/pokemon/:pokeid').delete(deletePokemonFromTeam);

export default router;
