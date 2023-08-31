import { Address, Chain, PublicClient, zeroAddress } from 'viem';
import { ChainId } from '@traderjoe-xyz/sdk-core';
import { LB_FACTORY_ADDRESS } from '@traderjoe-xyz/sdk-v2';
import { fetchTokens } from '../../utils/index.js';
import { v2 as v2Abis } from '../../abis/index.js';
import { v2 } from '../../entities/index.js';
import { PriceWithPairAddress } from '../../types.js';
import { PairInfoFetchError } from '../../errors.js';

export class FetchPriceByTokensService {
  constructor(
    private chain: Chain,
    private publicClient: PublicClient,
  ) {}

  public async execute(
    base: Address,
    quote: Address,
    binStep: number,
  ): Promise<PriceWithPairAddress> {
    const [[baseToken, quoteToken], [pairAddress, activeId]] = await Promise.all([
      fetchTokens(this.chainId, this.publicClient, base, quote),
      this.fetchPairAddress(base, quote, binStep).then(pairAddress =>
        this.fetchPairActiveId(pairAddress).then(activeId => [pairAddress, activeId] as const),
      ),
    ]);

    const pairPrice = new v2.PairPrice(baseToken, quoteToken, binStep);
    const price = pairPrice.getPrice(activeId);

    return {
      pair: pairAddress,
      price,
    };
  }

  private async fetchPairAddress(tokenA: Address, tokenB: Address, binStep: number) {
    try {
      const pairInfo = await this.publicClient.readContract({
        address: LB_FACTORY_ADDRESS[this.chainId],
        abi: v2Abis.LBFactoryABI,
        functionName: 'getLBPairInformation',
        args: [tokenA, tokenB, BigInt(binStep)],
      });
      if (pairInfo.LBPair === zeroAddress) {
        throw new Error('Pair address is zero address');
      }

      return pairInfo.LBPair;
    } catch (e) {
      throw new PairInfoFetchError(undefined, { cause: e });
    }
  }

  private async fetchPairActiveId(pairAddress: Address): Promise<bigint> {
    try {
      const [, , activeId] = await this.publicClient.readContract({
        address: pairAddress,
        abi: v2Abis.LBPairABI,
        functionName: 'getReservesAndId',
      });

      return activeId;
    } catch (e) {
      throw new PairInfoFetchError(undefined, { cause: e });
    }
  }

  private get chainId(): ChainId {
    return this.chain.id;
  }
}
