import { parseEnvToInt } from '../utils/index.js';

export const PORT: number = parseEnvToInt('PORT', { default: 3000 });

export const TIME_OUT = parseEnvToInt('TIME_OUT', { default: 10000 });

export const RATE_LIMIT_WINDOW_MS: number = parseEnvToInt('RATE_LIMIT_WINDOW_MS', {
  default: 1 * 60 * 1000,
});
export const RATE_LIMIT_MAX: number = parseEnvToInt('RATE_LIMIT_MAX', { default: 100 });
