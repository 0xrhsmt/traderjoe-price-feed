import { z } from 'zod';
import { Address, getAddress } from 'viem';

import { v2 } from '../../services/index.js';
import { ValidatedRequestHandler } from '../../types.js';
import { addressSchema } from '../../utils/zodSchemas.js';
import { getCacheKey, withCache } from '../../utils/index.js';
import { BLOCK_INTERVAL_CACHE_TIME } from '../../config/index.js';
import { CacheKeyType } from '../../constants.js';

export type BatchPricesControllerInputSchema = z.infer<typeof batchPricesControllerInputSchema>;

export const batchPricesControllerInputSchema = z.object({
  body: z.array(addressSchema).nonempty(),
});

export const batchPricesController: ValidatedRequestHandler<BatchPricesControllerInputSchema> =
  async function (_req, res) {
    const { chain, publicClient, input } = res.locals;
    const pairs: Address[] = input.body.map(p => getAddress(p));

    const service = new v2.FetchPriceByPairService(chain, publicClient);
    const prices = await Promise.all(
      pairs.map(async pair =>
        withCache(
          async () => {
            const result = await service.execute(pair);

            return {
              pair_address: pair,
              base_address: result.base,
              quote_address: result.quote,
              binstep: result.binStep,
              price: result.price,
            };
          },
          {
            cacheKey: getCacheKey(CacheKeyType.V2_PRICE_BY_PAIR, chain.id, pair),
            cacheTime: BLOCK_INTERVAL_CACHE_TIME,
          },
        ),
      ),
    );

    res.json({ prices });
  };
