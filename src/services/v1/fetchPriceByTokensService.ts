import { Address, Chain, PublicClient } from 'viem';
import { ChainId, Token } from '@traderjoe-xyz/sdk-core';

import { fetchTokens } from '../../utils/index.js';
import { v1 as v1Abi } from '../../abis/index.js';
import { v1 } from '../../entities/index.js';
import { PriceWithPairAddress } from '../../types.js';
import { PairInfoFetchError } from '../../errors.js';

export class FetchPriceByTokensService {
  constructor(
    private chain: Chain,
    private publicClient: PublicClient,
  ) {}

  public async execute(base: Address, quote: Address): Promise<PriceWithPairAddress> {
    const [baseToken, quoteToken] = await fetchTokens(this.chainId, this.publicClient, base, quote);
    const [pairAddress, reserves] = await this.fetchReserves(baseToken, quoteToken);

    const pairPrice = new v1.PairPrice(baseToken, quoteToken, reserves);
    const price = pairPrice.getPrice();

    return {
      pair: pairAddress,
      price,
    };
  }

  private async fetchReserves(
    baseToken: Token,
    quoteToken: Token,
  ): Promise<[Address, [bigint, bigint]]> {
    const pairAddress = await v1.Pair.getAddress(baseToken, quoteToken, this.chainId);

    try {
      const reserves = await this.publicClient.readContract({
        address: pairAddress,
        abi: v1Abi.PairABI,
        functionName: 'getReserves',
      });

      return [pairAddress, [reserves[0], reserves[1]]];
    } catch (e) {
      throw new PairInfoFetchError(undefined, { cause: e });
    }
  }

  private get chainId(): ChainId {
    return this.chain.id;
  }
}
