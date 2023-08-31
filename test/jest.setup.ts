import { beforeEach } from '@jest/globals';

import { cacheMap } from '../src/utils/withCache.js';

beforeEach(() => {
  cacheMap.clear();
});
