import { describe, it, expect } from '@jest/globals';

import { avalanche, arbitrum } from '../../../test/utils/index.js';

import { PairPrice } from './PairPrice';
import { PairNoLiquidityError } from '../../errors.js';

describe('PairPrice', () => {
  describe('#getPrice', () => {
    it('returns the correct price - avalanche WAVAX / USDC', () => {
      const base = avalanche.WAVAX;
      const quote = avalanche.USDC;

      const pairPrice = new PairPrice(base, quote, [
        3n * 10n ** BigInt(base.decimals), // 3 WAVAX
        1n * 10n ** BigInt(quote.decimals), // 1 USDC
      ]);
      expect(pairPrice.getPrice()).toBeCloseTo(0.333_333_333_333, 10);
    });

    it('returns the correct price - avalanche WAVAX / USDC', () => {
      const base = avalanche.WAVAX;
      const quote = avalanche.USDC;

      const pairPrice = new PairPrice(base, quote, [
        1n * 10n ** BigInt(base.decimals), // 1 WAVAX
        3n * 10n ** BigInt(quote.decimals), // 3 USDC
      ]);
      expect(pairPrice.getPrice()).toBeCloseTo(3, 10);
    });

    it('returns the correct price - avalanche WAVAX / USDC', () => {
      const base = avalanche.WAVAX;
      const quote = avalanche.USDC;

      const pairPrice = new PairPrice(base, quote, [
        1n * 10n ** BigInt(base.decimals),
        1n * 10n ** BigInt(quote.decimals),
      ]);
      expect(pairPrice.getPrice()).toBeCloseTo(1, 10);
    });

    it('returns the correct price - avalanche USDC / WAVAX', () => {
      const base = avalanche.USDC;
      const quote = avalanche.WAVAX;

      const pairPrice = new PairPrice(base, quote, [
        3n * 10n ** BigInt(quote.decimals), // 3 WAVAX
        1n * 10n ** BigInt(base.decimals), // 1 USDC
      ]);

      expect(pairPrice.getPrice()).toBeCloseTo(3, 10);
    });

    it('returns the correct price - avalanche USDC / WAVAX', () => {
      const base = avalanche.USDC;
      const quote = avalanche.WAVAX;

      const pairPrice = new PairPrice(base, quote, [
        1n * 10n ** BigInt(quote.decimals), // 1 WAVAX
        3n * 10n ** BigInt(base.decimals), // 3 USDC
      ]);

      expect(pairPrice.getPrice()).toBeCloseTo(0.333_333_333_333, 10);
    });

    it('returns the correct price - avalanche USDC / WAVAX', () => {
      const base = avalanche.USDC;
      const quote = avalanche.WAVAX;

      const pairPrice = new PairPrice(base, quote, [
        1n * 10n ** BigInt(quote.decimals), // 1 WAVAX
        1n * 10n ** BigInt(base.decimals), // 1 USDC
      ]);

      expect(pairPrice.getPrice()).toBeCloseTo(1, 10);
    });

    it('returns the correct price - arbitrum USDT / USDC', () => {
      const base = arbitrum.USDT;
      const quote = arbitrum.USDC;

      const pairPrice = new PairPrice(base, quote, [
        3n * 10n ** BigInt(base.decimals), // 3 USDT
        1n * 10n ** BigInt(quote.decimals), // 1 USDC
      ]);
      expect(pairPrice.getPrice()).toBeCloseTo(0.333_333_333_333, 10);
    });

    it('returns the correct price - arbitrum USDC / USDT', () => {
      const base = arbitrum.USDC;
      const quote = arbitrum.USDT;

      const pairPrice = new PairPrice(base, quote, [
        3n * 10n ** BigInt(base.decimals), // 3 USDT
        1n * 10n ** BigInt(quote.decimals), // 1 USDC
      ]);
      expect(pairPrice.getPrice()).toBeCloseTo(3, 10);
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
