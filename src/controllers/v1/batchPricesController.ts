import { z } from 'zod';

import { v1 } from '../../services/index.js';
import { ValidatedRequestHandler } from '../../types.js';
import { addressSchema } from '../../utils/zodSchemas.js';
import { Address, getAddress } from 'viem';
import { getCacheKey, withCache } from '../../utils/withCache.js';
import { CacheKeyType } from '../../constants.js';
import { BLOCK_INTERVAL_CACHE_TIME } from '../../config/cache.js';

export type BatchPricesControllerInputSchema = z.infer<typeof batchPricesControllerInputSchema>;

export const batchPricesControllerInputSchema = z.object({
  body: z.array(addressSchema).nonempty(),
});

export const batchPricesController: ValidatedRequestHandler<BatchPricesControllerInputSchema> =
  async function (_req, res) {
    const { chain, publicClient, input } = res.locals;
    const pairs: Address[] = input.body.map(p => getAddress(p));

    const service = new v1.FetchPriceByPairService(chain, publicClient);
    const prices = await Promise.all(
      pairs.map(pair =>
        withCache(
          async () => {
            const result = await service.execute(pair);

            return {
              pair_address: pair,
              base_address: result.base,
              quote_address: result.quote,
              price: result.price,
            };
          },
          {
            cacheKey: getCacheKey(CacheKeyType.V1_PRICE_BY_PAIR, chain.id, pair),
            cacheTime: BLOCK_INTERVAL_CACHE_TIME,
          },
        ),
      ),
    );

    res.json({ prices });
  };
