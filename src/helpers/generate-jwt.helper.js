'use strict';

import jwt from 'jsonwebtoken';
import { SECRETORKEY } from '../config';

export const createToken = user =>
  jwt.sign({ id: user.id }, SECRETORKEY, { expiresIn: '24h' });
