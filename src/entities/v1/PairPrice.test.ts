import { describe, it, expect } from '@jest/globals';

import { avalanche, arbitrum } from '../../../test/utils/index.js';

import { PairPrice } from './PairPrice';
import { PairNoLiquidityError } from '../../errors.js';

describe('PairPrice', () => {
  describe('#getPrice', () => {
    it('returns the correct price', () => {
      const pairPrice = new PairPrice(avalanche.WAVAX, avalanche.USDC, [
        85719620932479197620541n,
        912720031038n,
      ]);
      expect(pairPrice.getPrice()).toBeCloseTo(10.647737602070636, 10);
    });

    it('returns the correct price - arb', () => {
      const pairPrice = new PairPrice(arbitrum.USDT, arbitrum.USDC, [1664388n, 1660876n]);
      expect(pairPrice.getPrice()).toBeCloseTo(0.9978899150919136, 10);
    });

    it('throw a PairNoLiquidityError when the reserve of the base token is zero', () => {
      const pairPrice = new PairPrice(avalanche.WAVAX, avalanche.USDC, [0n, 1n]);
      expect(() => pairPrice.getPrice()).toThrowError(new PairNoLiquidityError());
    });

    it('returns zero when the reserve of the quote token is zero', () => {
      const pairPrice = new PairPrice(avalanche.WAVAX, avalanche.USDC, [1n, 0n]);
      expect(pairPrice.getPrice()).toEqual(0);
    });

    it('throw a PairNoLiquidityError when the reserves of both tokens are zero', () => {
      const pairPrice = new PairPrice(avalanche.WAVAX, avalanche.USDC, [0n, 0n]);
      expect(() => pairPrice.getPrice()).toThrowError(new PairNoLiquidityError());
    });
  });
});
