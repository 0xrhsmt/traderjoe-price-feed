import { describe, it, expect } from '@jest/globals';
import { getAddress, zeroAddress } from 'viem';

import { FetchPriceByTokensService } from './fetchPriceByTokensService.js';
import { CHAIN, chainClient } from '../../config/index.js';
import { avalanche } from '../../../test/utils/index.js';
import { PairInfoFetchError } from '../../errors.js';

describe('FetchPriceByTokensService', () => {
  it('returns the correct price', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);
    const price = await service.execute(
      getAddress(avalanche.WAVAX.address),
      getAddress(avalanche.USDC.address),
      20,
    );

    expect(price).toEqual({
      pair: avalanche.v2_1.WAVAX_USDC_20_PAIR.address,
      price: expect.closeTo(10.657644695413893, 10),
    });
  });

  it('returns the correct price - reverse base and quote', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);
    const price = await service.execute(
      getAddress(avalanche.USDC.address),
      getAddress(avalanche.WAVAX.address),
      20,
    );

    expect(price).toEqual({
      pair: avalanche.v2_1.WAVAX_USDC_20_PAIR.address,
      price: expect.closeTo(0.0938293617941975, 10),
    });
  });

  it('throw a PairInfoFetchError when a non-deployed token address is passed', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);

    expect(async () => {
      return service.execute(getAddress(zeroAddress), getAddress(zeroAddress), 20);
    }).rejects.toThrowError();
  });

  it('throw a PairInfoFetchError when a invalid binstep is passed', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);

    expect(async () => {
      return service.execute(
        getAddress(avalanche.WAVAX.address),
        getAddress(avalanche.USDC.address),
        99999,
      );
    }).rejects.toThrowError(PairInfoFetchError);
  });

  it('throw a PairInfoFetchError when pair is not deployed', async () => {
    const service = new FetchPriceByTokensService(CHAIN, chainClient);

    expect(async () => {
      return service.execute(
        getAddress(avalanche.GMX.address),
        getAddress(avalanche.LINK.address),
        20,
      );
    }).rejects.toThrowError(PairInfoFetchError);
  });

  // TODO: when base token liquidity === 0
  // TODO: when quote token liquidity === 0
});
