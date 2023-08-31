import { ConfigurationError } from '../errors.js';

export const parseEnvToInt = (key: string, options?: { default?: number }): number => {
  const value = process.env[key];
  const parsedValue = parseInt(value ?? '', 10);
  if (isNaN(parsedValue)) {
    if (options?.default === undefined) {
      throw new ConfigurationError(`Missing environment variable: ${key}`);
    }
    return options.default;
  }
  return parsedValue;
};
