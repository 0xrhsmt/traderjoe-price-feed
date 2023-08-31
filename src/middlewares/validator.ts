import express from 'express';
import { AnyZodObject } from 'zod';

import { RequestInputValidationError } from '../errors.js';

export const validator =
  (schema: AnyZodObject) =>
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const input = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!input.success) {
      const error = new RequestInputValidationError(
        input.error,
        'Validation Error: invalid request input',
      );

      next(error);
      return;
    }

    res.locals.input = input.data;
    next();
  };
