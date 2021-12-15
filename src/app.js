'use strict';

import express from 'express';

import './db/db';
import { setupMiddlewares } from './middlewares/setup.middleware';
import { authRouter, teamRoutes } from './routes';

// Initializations:
const app = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/join', authRouter);
app.use('/teams', teamRoutes);

export default app;
