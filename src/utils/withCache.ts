import { CacheKeyType } from '../constants.js';

export const cacheMap = new Map();

export type CacheParams = {
  cacheKey: string;
  cacheTime?: number;
};

export async function withCache<T>(
  fn: () => Promise<T>,
  { cacheKey, cacheTime = Infinity }: CacheParams,
) {
  const cache = getCache<T>(cacheKey);

  const cachedData = cache.get();
  if (cachedData && cacheTime > 0) {
    const age = new Date().getTime() - cachedData.created.getTime();
    if (age < cacheTime) return cachedData.data;
  }

  const data = await fn();

  cache.set(data);

  return data;
}

export function getCache<T>(cacheKey: string) {
  return {
    clear: () => cacheMap.delete(cacheKey),
    get: () => cacheMap.get(cacheKey),
    set: (data: T) => cacheMap.set(cacheKey, { created: new Date(), data }),
  };
}

export const getCacheKey = (prefix: CacheKeyType, ...names: unknown[]) =>
  `${prefix}:${names.join(':')}`;
