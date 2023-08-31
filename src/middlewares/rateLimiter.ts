import { rateLimit } from 'express-rate-limit';

import { API_RATE_LIMIT_WINDOW_MS, API_RATE_LIMIT_MAX } from '../config/index.js';
import { TooManyRequestsError } from '../errors.js';

export const rateLimiter = rateLimit({
  windowMs: API_RATE_LIMIT_WINDOW_MS,
  max: API_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new TooManyRequestsError();
    next(error);
  },
});
