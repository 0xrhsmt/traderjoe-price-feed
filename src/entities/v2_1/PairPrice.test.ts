import { describe, it, expect } from '@jest/globals';

import { avalanche, arbitrum } from '../../../test/utils/index.js';
import { PairPrice } from './PairPrice';

describe('PairPrice', () => {
  describe('#getPrice', () => {
    it('returns the correct price', () => {
      const binStep = 20;
      const pairPrice = new PairPrice(avalanche.WAVAX, avalanche.USDC, binStep);

      const activeId = 8375961;
      const price = 10.615141668174521;
      expect(pairPrice.getPrice(activeId)).toBeCloseTo(price, 10);
    });

    it('returns the correct price - arb', () => {
      const binStep = 1;
      const pairPrice = new PairPrice(arbitrum.USDT, arbitrum.USDC, binStep);

      const activeId = 8388606;
      const price = 0.9998000299960005;
      expect(pairPrice.getPrice(activeId)).toBeCloseTo(price, 10);
    });

    it('returns 1.0 when the activeId is 2^23', () => {
      const binStep = 1;
      const pairPrice = new PairPrice(arbitrum.USDT, arbitrum.USDC, binStep);

      const activeId = 2 ** 23;
      const price = 1;
      expect(pairPrice.getPrice(activeId)).toBeCloseTo(price, 10);
    });

    it('returns almost zero when the activeId is zero', () => {
      const binStep = 1;
      const pairPrice = new PairPrice(arbitrum.USDT, arbitrum.USDC, binStep);

      const activeId = 0;
      const price = 0;
      expect(pairPrice.getPrice(activeId)).toBeCloseTo(price, 10);
    });
  });
});
