import express from 'express';
import { pinoHttp } from 'pino-http';

import { logger as pinoLogger } from '../logger.js';

export const httpLogger = pinoHttp({
  logger: pinoLogger,
  customLogLevel: function (_req, res, error) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'info';
    } else if (res.statusCode >= 500 || error) {
      return 'error';
    }
    return 'info';
  },
});

// NOTE: This is a middleware that add the error to the log
export const logError = (res: express.Response, error: Error) => {
  res.err = error;
};
