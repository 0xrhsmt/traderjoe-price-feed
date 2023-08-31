import { z } from 'zod';
import { getAddress } from 'viem';

import { v1 } from '../../services/index.js';
import { ValidatedRequestHandler } from '../../types.js';
import { addressSchema, withCache, getCacheKey } from '../../utils/index.js';
import { CacheKeyType } from '../../constants.js';
import { BLOCK_INTERVAL_CACHE_TIME } from '../../config/index.js';

export type PricesControllerInputSchema = z.infer<typeof pricesControllerInputSchema>;

export const pricesControllerInputSchema = z.object({
  params: z.object({
    base: addressSchema,
    quote: addressSchema,
  }),
});

export const pricesController: ValidatedRequestHandler<PricesControllerInputSchema> =
  async function (_req, res) {
    const { chain, publicClient, input } = res.locals;
    const base = getAddress(input.params.base);
    const quote = getAddress(input.params.quote);

    const price = await withCache(
      () => {
        const service = new v1.FetchPriceByTokensService(chain, publicClient);
        return service.execute(base, quote);
      },
      {
        cacheKey: getCacheKey(CacheKeyType.V1_PRICE_BY_TOKENS, chain.id, base, quote),
        cacheTime: BLOCK_INTERVAL_CACHE_TIME,
      },
    );

    res.json({
      price: {
        pair_address: price.pair,
        base_address: getAddress(base),
        quote_address: getAddress(quote),
        price: price.price,
      },
    });
  };
