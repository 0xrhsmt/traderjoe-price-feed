import { rateLimit } from 'express-rate-limit';

import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } from '../config/index.js';
import { TooManyRequestsError } from '../errors.js';

export const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new TooManyRequestsError();
    next(error);
  },
});
