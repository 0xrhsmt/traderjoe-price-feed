import { z } from 'zod';

import { v2 } from '../../services/index.js';
import { ValidatedRequestHandler } from '../../types.js';
import { addressSchema } from '../../utils/zodSchemas.js';
import { getAddress } from 'viem';
import { getCacheKey, withCache } from '../../utils/withCache.js';
import { CacheKeyType } from '../../constants.js';
import { BLOCK_INTERVAL_CACHE_TIME } from '../../config/index.js';

export type PricesControllerInputSchema = z.infer<typeof pricesControllerInputSchema>;

export const pricesControllerInputSchema = z.object({
  params: z.object({
    base: addressSchema,
    quote: addressSchema,
    binStep: z.coerce.number().int().positive(),
  }),
});

export const pricesController: ValidatedRequestHandler<PricesControllerInputSchema> =
  async function (_req, res) {
    const { chain, publicClient, input } = res.locals;
    const { base, quote, binStep } = input.params;

    const price = await withCache(
      async () => {
        const service = new v2.FetchPriceByTokensService(chain, publicClient);
        return service.execute(base, quote, binStep);
      },
      {
        cacheKey: getCacheKey(CacheKeyType.V2_PRICE_BY_TOKENS, chain.id, base, quote),
        cacheTime: BLOCK_INTERVAL_CACHE_TIME,
      },
    );

    res.json({
      price: {
        pair_address: price.pair,
        base_address: getAddress(base),
        quote_address: getAddress(quote),
        binstep: binStep,
        price: price.price,
      },
    });
  };
