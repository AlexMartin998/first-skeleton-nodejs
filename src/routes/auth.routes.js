'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { signIn, signUp } from '../controllers/';
import { isAlreadyRegistered, userExistAuth } from '../helpers';
import { validateFields } from '../middlewares';

const router = Router();

router.post(
  '/signup',

  // TODO: Llevar estos check a un  auth.http.js <- auth.controller.js
  [
    check('name', 'Name is required!').exists(),
    check('email', 'Invalid email!').isEmail(),
    check('password', 'Password must be longer than 6 characters.').isLength({
      min: 6,
    }),
    validateFields,
    check('email').custom(isAlreadyRegistered),
    validateFields,
  ],

  signUp
);

router.post(
  '/login',

  [
    check('email', 'Invalid email!').isEmail(),
    check('password', 'Password is required!').exists(),
    validateFields,
    check('email').custom(userExistAuth),
    validateFields,
  ],

  signIn
);

router.route('/private').get((req, res) => {
  res.status(200).json({ msg: 'Ok' });
});

export default router;
