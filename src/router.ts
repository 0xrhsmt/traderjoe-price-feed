import express from 'express';

import { validator } from './middlewares/index.js';
import { v1, v2, v2_1 } from './controllers/index.js';
import { asyncHandler } from './utils/index.js';
import { RequestHandler } from 'express-serve-static-core';

const router = express.Router();

router.get(
  '/v1/prices/:base/:quote',
  validator(v1.pricesControllerInputSchema),
  asyncHandler(v1.pricesController as RequestHandler),
);
router.post(
  '/v1/batch-prices',
  validator(v1.batchPricesControllerInputSchema),
  asyncHandler(v1.batchPricesController as RequestHandler),
);

router.get(
  '/v2/prices/:base/:quote/:binStep',
  validator(v2.pricesControllerInputSchema),
  asyncHandler(v2.pricesController as RequestHandler),
);
router.post(
  '/v2/batch-prices',
  validator(v2.batchPricesControllerInputSchema),
  asyncHandler(v2.batchPricesController as RequestHandler),
);

router.get(
  '/v2_1/prices/:base/:quote/:binStep',
  validator(v2_1.pricesControllerInputSchema),
  asyncHandler(v2_1.pricesController as RequestHandler),
);
router.post(
  '/v2_1/batch-prices',
  validator(v2_1.batchPricesControllerInputSchema),
  asyncHandler(v2_1.batchPricesController as RequestHandler),
);

export { router };
