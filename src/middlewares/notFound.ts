import express from 'express';

import { NotFoundError } from '../errors.js';

export const notFoundErrorCatcher: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  next(new NotFoundError());
};
