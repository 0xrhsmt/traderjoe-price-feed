import { describe, it, expect } from '@jest/globals';
import { getAddress, zeroAddress } from 'viem';

import { FetchPriceByPairService } from './fetchPriceByPairService.js';
import { CHAIN, chainClient } from '../../config/index.js';
import { avalanche } from '../../../test/utils/index.js';
import { PairInfoFetchError } from '../../errors';

describe('FetchPriceByPairService', () => {
  it('returns the correct price', async () => {
    const service = new FetchPriceByPairService(CHAIN, chainClient);
    const price = await service.execute(getAddress(avalanche.v1.WAVAX_USDC_PAIR.address));

    expect(price).toEqual({
      base: avalanche.WAVAX.address,
      quote: avalanche.USDC.address,
      price: expect.closeTo(10.647737602070636, 10),
    });
  });

  it('throw a PairInfoFetchError when a non-deployed pair address is passed', async () => {
    const service = new FetchPriceByPairService(CHAIN, chainClient);

    expect(async () => {
      return service.execute(zeroAddress);
    }).rejects.toThrowError(PairInfoFetchError);
  });

  // TODO: when base token liquidity === 0
  // TODO: when quote token liquidity === 0
});
