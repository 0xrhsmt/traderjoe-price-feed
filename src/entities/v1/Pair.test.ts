import { describe, it, expect } from '@jest/globals';
import { ChainId } from '@traderjoe-xyz/sdk-core';
import { Pair } from './Pair.js';

import { avalanche, arbitrum } from '../../../test/utils/index.js';

describe('Pair', () => {
  describe('.getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(avalanche.WAVAX, avalanche.USDC, ChainId.AVALANCHE)).toEqual(
        avalanche.v1.WAVAX_USDC_PAIR.address,
      );
    });
    it('returns the correct address - arb', () => {
      expect(Pair.getAddress(arbitrum.USDT, arbitrum.USDC, ChainId.ARBITRUM_ONE)).toEqual(
        arbitrum.v1.USDT_USDC_PAIR.address,
      );
    });
  });
});
