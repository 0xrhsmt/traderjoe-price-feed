import express from 'express';

export const asyncHandler = (func: express.RequestHandler) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const fnReturn = func(req, res, next);

    return Promise.resolve(fnReturn).catch(next);
  };
};
