import { API_PORT } from './config/index.js';
import { app } from './app.js';
import { logger } from './logger.js';

function main() {
  app.listen(API_PORT, () => logger.info(`Server running on port ${API_PORT}`));
}

process.on('uncaughtException', error => {
  logger.error(error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  if (error) {
    logger.error(error);
  }
});

main();
