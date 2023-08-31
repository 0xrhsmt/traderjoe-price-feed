import { Address, Chain, PublicClient, getAddress } from 'viem';
import { ChainId } from '@traderjoe-xyz/sdk-core';

import { PriceWithTokens } from '../../types.js';
import { fetchTokens, withCache, getCacheKey } from '../../utils/index.js';
import { v1 as v1Abi } from '../../abis/index.js';
import { v1 } from '../../entities/index.js';
import { CacheKeyType } from '../../constants.js';
import { PairInfoFetchError } from '../../errors.js';

export class FetchPriceByPairService {
  constructor(
    private chain: Chain,
    private publicClient: PublicClient,
  ) {}

  public async execute(pair: Address): Promise<PriceWithTokens> {
    const [base, quote, reserves] = await this.fetchPairInformaion(pair);
    const [baseToken, quoteToken] = await fetchTokens(this.chainId, this.publicClient, base, quote);

    const pairPrice = new v1.PairPrice(baseToken, quoteToken, reserves);
    const price = pairPrice.getPrice();

    return {
      base: getAddress(baseToken.address),
      quote: getAddress(quoteToken.address),
      price,
    };
  }

  private async fetchPairInformaion(
    pairAddress: Address,
  ): Promise<[Address, Address, readonly [bigint, bigint]]> {
    try {
      const result = await Promise.all([
        withCache(
          () =>
            this.publicClient.readContract({
              address: pairAddress,
              abi: v1Abi.PairABI,
              functionName: 'token0',
            }),
          { cacheKey: getCacheKey(CacheKeyType.V1_PAIR_TOKEN0, this.chainId, pairAddress) },
        ),
        withCache(
          () =>
            this.publicClient.readContract({
              address: pairAddress,
              abi: v1Abi.PairABI,
              functionName: 'token1',
            }),
          { cacheKey: getCacheKey(CacheKeyType.V1_PAIR_TOKEN1, this.chainId, pairAddress) },
        ),

        this.publicClient
          .readContract({
            address: pairAddress,
            abi: v1Abi.PairABI,
            functionName: 'getReserves',
          })
          .then(reserves => [reserves[0], reserves[1]] as [bigint, bigint]),
      ]);

      return result;
    } catch (e) {
      throw new PairInfoFetchError(undefined, { cause: e });
    }
  }

  private get chainId(): ChainId {
    return this.chain.id;
  }
}
