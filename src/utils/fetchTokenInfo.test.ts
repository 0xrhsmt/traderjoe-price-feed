import { describe, expect, it } from '@jest/globals';
import { CHAIN, chainClient } from '../config/index.js';
import { avalanche } from '../../test/utils/index.js';
import { fetchTokens, fetchTokenInfo } from './fetchTokenInfo.js';
import { Address, zeroAddress } from 'viem';
import { TokenInfoFetchError } from '../errors.js';

describe('fetchTokens', () => {
  describe('when the tokens exist', () => {
    it('returns the tokens', async () => {
      const tokens = await fetchTokens(
        CHAIN.id,
        chainClient,
        avalanche.WAVAX.address as Address,
        avalanche.USDC.address as Address,
      );

      expect(tokens.length).toBe(2);
      expect(tokens[0].address).toBe(avalanche.WAVAX.address);
      expect(tokens[1].address).toBe(avalanche.USDC.address);
    });
  });

  describe('when the tokens does not exist', () => {
    it('throw a TokenInfoFetchError', async () => {
      expect(async () => {
        return fetchTokens(CHAIN.id, chainClient, avalanche.WAVAX.address as Address, zeroAddress);
      }).rejects.toThrowError(TokenInfoFetchError);
    });
  });
});

describe('fetchTokenInfo', () => {
  describe('when the token exists', () => {
    it('should return the token', async () => {
      const token = await fetchTokenInfo(
        CHAIN.id,
        chainClient,
        avalanche.WAVAX.address as Address,
        avalanche.WAVAX.symbol,
        avalanche.WAVAX.name,
      );

      expect(token.address).toBe(avalanche.WAVAX.address);
      expect(token.decimals).toBe(avalanche.WAVAX.decimals);
      expect(token.symbol).toBe(avalanche.WAVAX.symbol);
      expect(token.name).toBe(avalanche.WAVAX.name);
    });
  });

  describe('when the token does not exists', () => {
    it('throw a TokenInfoFetchError', async () => {
      expect(async () => {
        return fetchTokenInfo(CHAIN.id, chainClient, zeroAddress, 'TEST', 'TEST Token');
      }).rejects.toThrowError(TokenInfoFetchError);
    });
  });
});
