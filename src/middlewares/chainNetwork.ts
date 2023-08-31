import express from 'express';

import { CHAIN, chainClient } from '../config/index.js';

export const chainNetwork: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.locals.chain = CHAIN;
  res.locals.publicClient = chainClient;

  next();
};
