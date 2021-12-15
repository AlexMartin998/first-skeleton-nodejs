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
    check('team', 'Invalid team!').isArray().notEmpty(),
    check('trainer', 'Invalid trainer!').isMongoId(),
    validateFields,
  ],

  addPokemonToTeam
);

router.route('/pokemon/:id').delete(
  [check('id', 'Invalid ID!').isMongoId(), validateFields],

  deletePokemonFromTeam
);

export default router;
