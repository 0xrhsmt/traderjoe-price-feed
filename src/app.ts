import express from 'express';
import cors from 'cors';

import {
  rateLimiter,
  httpLogger,
  errorHandler,
  chainNetwork,
  timeout,
  timeoutErrorCather,
  notFoundErrorCatcher,
} from './middlewares/index.js';
import { router } from './router.js';
import { API_RATE_LIMIT_SKIP } from './config/index.js';

const app = express();
app.use(httpLogger);
app.use(timeout);
if (!API_RATE_LIMIT_SKIP) {
  app.use(rateLimiter);
}
app.use(cors());
app.use(express.json());
app.use(chainNetwork);

app.use('/', router);

app.use(notFoundErrorCatcher);
app.use(timeoutErrorCather);
app.use(errorHandler);

export { app };
