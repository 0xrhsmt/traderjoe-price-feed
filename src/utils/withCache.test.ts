import { describe, expect, it } from '@jest/globals';
import { getCache, withCache } from './withCache';
import { jest } from '@jest/globals';

describe('withCache', () => {
  it('make a cache', async () => {
    await withCache(() => Promise.resolve('TEST_VALUE'), { cacheKey: 'TEST_KEY' });
    const cache = getCache('TEST_KEY');

    expect(cache.get()).toEqual({ created: expect.any(Date), data: 'TEST_VALUE' });
  });

  it('return cached data and not call the callback', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('SECOND_TEST_VALUE'));

    const data = await withCache(() => Promise.resolve('FIRST_TEST_VALUE'), {
      cacheKey: 'TEST_KEY',
    });
    const cachedData = await withCache(() => mockCallback(), {
      cacheKey: 'TEST_KEY',
    });

    expect(data).toEqual('FIRST_TEST_VALUE');
    expect(cachedData).toEqual('FIRST_TEST_VALUE');
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
