'use strict';

import { User } from '../models';

// Auth
export const userExistAuth = async (email = '') => {
  const user = await User.findOne({ email });

  if (!user || !user.state)
    throw new Error(
      'There was a problem logging in. Check your email and password or create an account.'
    );
};

// Users
export const isAlreadyRegistered = async (email = '') => {
  const emailExist = await User.findOne({ email });
  if (emailExist)
    throw new Error(`The email '${email}' is already registered!`);
};
