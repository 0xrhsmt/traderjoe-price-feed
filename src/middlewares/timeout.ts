import connectTimeout from 'connect-timeout';

import { API_TIME_OUT } from '../config/index.js';
import express from 'express';
import { RequestTimeoutError } from '../errors.js';

export const timeout = connectTimeout(API_TIME_OUT, { respond: true });

export const timeoutErrorCather: express.ErrorRequestHandler = (error, req, res, next) => {
  if (error.timeout) {
    next(new RequestTimeoutError('Request Timeout', { cause: error }));
    return;
  }

  next(error);
};
