import { describe, it, expect } from '@jest/globals';
import { getAddress, zeroAddress } from 'viem';

import { FetchPriceByTokensService } from './fetchPriceByTokensService.js';
import { CHAIN, chainClient } from '../../config/index.js';
import { avalanche } from '../../../test/utils/index.js';
import { PairInfoFetchError, TokenInfoFetchError } from '../../errors.js';

describe('FetchPriceByTokensService', () => {
  it('returns the correct price', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);
    const price = await service.execute(
      getAddress(avalanche.WAVAX.address),
      getAddress(avalanche.USDC.address),
    );

    expect(price).toEqual({
      pair: avalanche.v1.WAVAX_USDC_PAIR.address,
      price: expect.closeTo(10.647737602070636, 10),
    });
  });

  it('returns the correct price - reverse base and quote', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);
    const price = await service.execute(
      getAddress(avalanche.USDC.address),
      getAddress(avalanche.WAVAX.address),
    );

    expect(price).toEqual({
      pair: avalanche.v1.WAVAX_USDC_PAIR.address,
      price: expect.closeTo(0.0939166644945807, 10),
    });
  });

  it('throw a PairInfoFetchError when a non-deployed token address is passed', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);

    expect(async () => {
      return service.execute(getAddress(zeroAddress), getAddress(zeroAddress));
    }).rejects.toThrowError(TokenInfoFetchError);
  });

  it('throw a PairInfoFetchError when pair is not deployed', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);

    expect(async () => {
      return service.execute(getAddress(avalanche.GMX.address), getAddress(avalanche.LINK.address));
    }).rejects.toThrowError(PairInfoFetchError);
  });

  // TODO: when base token liquidity === 0
  // TODO: when quote token liquidity === 0
});
