import { pino } from 'pino';

import { LOG_LEVEL } from './config/index.js';

export const logger = pino({
  level: LOG_LEVEL,
});
