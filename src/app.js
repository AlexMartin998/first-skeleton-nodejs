'use strict';
console.clear();

import app from './server';
import { PORT } from './config';

export const server = app.listen(PORT, () => {
  console.log('Server on port', PORT);
});
