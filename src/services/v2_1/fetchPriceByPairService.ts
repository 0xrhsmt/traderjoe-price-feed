import { Address, Chain, PublicClient, getAddress } from 'viem';
import { ChainId } from '@traderjoe-xyz/sdk-core';

import { PriceWithTokensAndBinStep } from '../../types.js';
import { fetchTokens } from '../../utils/index.js';
import { v2_1 } from '../../entities/index.js';
import { v2_1 as v2_1Abis } from '../../abis/index.js';
import { PairInfoFetchError } from '../../errors.js';

export class FetchPriceByPairService {
  constructor(
    private chain: Chain,
    private publicClient: PublicClient,
  ) {}

  public async execute(pair: Address): Promise<PriceWithTokensAndBinStep> {
    const [base, quote, binStep, activeId] = await this.fetchPairInformaion(pair);
    const [baseToken, quoteToken] = await fetchTokens(this.chainId, this.publicClient, base, quote);

    const pairPrice = new v2_1.PairPrice(baseToken, quoteToken, binStep);
    const price = pairPrice.getPrice(activeId);

    return {
      base: getAddress(baseToken.address),
      quote: getAddress(quoteToken.address),
      binStep,
      price: price,
    };
  }

  private async fetchPairInformaion(
    pairAddress: Address,
  ): Promise<[Address, Address, number, number]> {
    try {
      const result = Promise.all([
        await this.publicClient.readContract({
          address: pairAddress,
          abi: v2_1Abis.LBPairABI,
          functionName: 'getTokenX',
        }),
        await this.publicClient.readContract({
          address: pairAddress,
          abi: v2_1Abis.LBPairABI,
          functionName: 'getTokenY',
        }),
        await this.publicClient.readContract({
          address: pairAddress,
          abi: v2_1Abis.LBPairABI,
          functionName: 'getBinStep',
        }),
        await this.publicClient.readContract({
          address: pairAddress,
          abi: v2_1Abis.LBPairABI,
          functionName: 'getActiveId',
        }),
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
