import { LevelWithSilent } from 'pino';

export const LOG_LEVEL: LevelWithSilent = process.env.LOG_LEVEL
  ? (process.env.LOG_LEVEL as LevelWithSilent)
  : 'info';
