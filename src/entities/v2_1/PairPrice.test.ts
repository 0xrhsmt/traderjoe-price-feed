import { describe, it, expect } from '@jest/globals';

import { avalanche, arbitrum } from '../../../test/utils/index.js';
import { PairPrice } from './PairPrice';

describe('PairPrice', () => {
  describe('#getPrice', () => {
    it('returns the correct price', () => {
      const base = avalanche.sAVAX;
      const quote = avalanche.WAVAX;
      const binStep = 5;

      const pairPrice = new PairPrice(base, quote, binStep);

      const activeId = 8388755;
      const price = pairPrice.getPrice(activeId);
      const correctPrice = 1.0762487670087693;

      expect(price).toBeCloseTo(correctPrice, 10);
    });

    it('returns the correct price', () => {
      const base = avalanche.BTCb;
      const quote = avalanche.USDC;
      const binStep = 10;

      const pairPrice = new PairPrice(base, quote, binStep);

      const activeId = 8394314;
      const price = pairPrice.getPrice(activeId);
      const correctPrice = 29980.99879750467;

      expect(price).toBeCloseTo(correctPrice, 10);
    });

    it('returns 1.0 when the activeId is 2^23', () => {
      const base = arbitrum.USDT;
      const quote = arbitrum.USDC;
      const binStep = 20;

      const pairPrice = new PairPrice(base, quote, binStep);

      const activeId = 2 ** 23;
      const price = pairPrice.getPrice(activeId);
      const correctPrice = 1;

      expect(price).toBeCloseTo(correctPrice, 10);
    });

    it('returns almost 0 when activeId is 0', () => {
      const base = arbitrum.USDT;
      const quote = arbitrum.USDC;
      const binStep = 20;

      const pairPrice = new PairPrice(base, quote, binStep);

      const activeId = 0;
      const price = pairPrice.getPrice(activeId);
      const correctPrice = 0;

      expect(price).toBeCloseTo(correctPrice, 10);
    });
  });
});
