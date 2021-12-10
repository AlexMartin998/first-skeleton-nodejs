'use strict';

import { User } from '../models';
import { createToken } from '../helpers';

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });

  // Save in DB
  await newUser.save();

  res.status(201).json({
    msg: 'Create - POST  |  Controller',
    user: newUser,
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Check password
  const matchPass = await user.comparePassword(password);
  if (!matchPass)
    return res.status(400).json({
      msg: 'There was a problem logging in. Check your email and password or create an account. (Incorrect Pass)',
    });

  // Generate JWT
  const token = `JWT ${createToken(user)}`;

  res.json({ msg: 'Ok!', token });
};
