import { Address, Chain, PublicClient, getAddress } from 'viem';
import { ChainId } from '@traderjoe-xyz/sdk-core';

import { PriceWithTokensAndBinStep } from '../../types.js';
import { v2 as v2Abis } from '../../abis/index.js';
import { v2 } from '../../entities/index.js';
import { fetchTokens } from '../../utils/index.js';
import { PairInfoFetchError } from '../../errors.js';

export class FetchPriceByPairService {
  constructor(
    private chain: Chain,
    private publicClient: PublicClient,
  ) {}

  public async execute(pair: Address): Promise<PriceWithTokensAndBinStep> {
    const [base, quote, binStep, activeId] = await this.fetchPairInformaion(pair);
    const [baseToken, quoteToken] = await fetchTokens(this.chainId, this.publicClient, base, quote);

    const pairPrice = new v2.PairPrice(baseToken, quoteToken, binStep);
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
  ): Promise<[Address, Address, number, bigint]> {
    try {
      const result = await Promise.all([
        this.publicClient.readContract({
          address: pairAddress,
          abi: v2Abis.LBPairABI,
          functionName: 'tokenX',
        }),
        this.publicClient.readContract({
          address: pairAddress,
          abi: v2Abis.LBPairABI,
          functionName: 'tokenY',
        }),
        this.publicClient
          .readContract({
            address: pairAddress,
            abi: v2Abis.LBPairABI,
            functionName: 'feeParameters',
          })
          .then(feeParameters => feeParameters.binStep),
        this.publicClient
          .readContract({
            address: pairAddress,
            abi: v2Abis.LBPairABI,
            functionName: 'getReservesAndId',
          })
          .then(reservesAndId => reservesAndId[2]),
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
