'use strict';
console.clear();

import app from './server';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log('Server on port', PORT);
});
