import { getAddress, Address, PublicClient } from 'viem';
import { Token, ChainId } from '@traderjoe-xyz/sdk-core';

import { ERC20_ABI } from '../abis/index.js';
import { withCache, getCacheKey } from './withCache.js';
import { CacheKeyType } from '../constants.js';
import { TokenInfoFetchError } from '../errors.js';

export const fetchTokens = async (
  chainId: ChainId,
  publicClient: PublicClient,
  ...addresses: Address[]
): Promise<Token[]> => {
  return Promise.all(addresses.map(a => fetchTokenInfo(chainId, publicClient, a)));
};

export const fetchTokenInfo = async (
  chainId: ChainId,
  publicClient: PublicClient,
  address: Address,
  symbol?: string,
  name?: string,
): Promise<Token> => {
  try {
    const decimals = await withCache(
      () =>
        publicClient.readContract({
          abi: ERC20_ABI,
          functionName: 'decimals',
          address: getAddress(address),
        }),
      { cacheKey: getCacheKey(CacheKeyType.ERC20_DECIMALS, chainId, address) },
    );

    return new Token(chainId, address, decimals, symbol, name);
  } catch (e) {
    throw new TokenInfoFetchError(undefined, { cause: e });
  }
};
