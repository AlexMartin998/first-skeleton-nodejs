'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import {
  initializePassport,
  passportInit,
  protectWithJWT,
} from './auth.middleware';

export const setupMiddlewares = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors()).use(helmet()).use(compression());
  app.use(morgan('dev'));

  // Passport
  app.use(initializePassport());
  passportInit();
  app.use(protectWithJWT);
};
