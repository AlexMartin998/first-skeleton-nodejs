'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

export const setupMiddlewares = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors()).use(helmet()).use(compression());

  // Passport
};
