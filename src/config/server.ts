import { parseEnvToInt } from '../utils/index.js';

export const API_PORT: number = parseEnvToInt('API_PORT', { default: 3000 });

export const API_TIME_OUT = parseEnvToInt('API_TIME_OUT', { default: 5000 });

export const API_RATE_LIMIT_SKIP = process.env.API_RATE_LIMIT_SKIP === 'true';
export const API_RATE_LIMIT_WINDOW_MS: number = parseEnvToInt('API_RATE_LIMIT_WINDOW_MS', {
  default: 1 * 60 * 1000, // 1 minute
});
export const API_RATE_LIMIT_MAX: number = parseEnvToInt('API_RATE_LIMIT_MAX', { default: 100 });
