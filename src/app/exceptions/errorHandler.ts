import express, { ErrorRequestHandler, Response, NextFunction } from 'express'
import { HttpError } from './httpError';
import statusCode from 'http-status-codes';

export const errorRequestHandler: ErrorRequestHandler = (err: Error, _req: express .Request, res: express.Response, _next: NextFunction) => {
  const [status, message] =
    err instanceof HttpError ? [err.statusCode, err.message] : [statusCode.INTERNAL_SERVER_ERROR, 'Internal server error'];

  console.error(err);

  res.status(status).json({ error: { message } });
}

export default errorRequestHandler;
