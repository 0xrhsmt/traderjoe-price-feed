import { ChainId } from '@traderjoe-xyz/sdk-core';
import { parseEnvToInt } from '../utils/index.js';
import { CHAIN } from './chain.js';

const getDefaultBlockIntervalCache = () => {
  let blockAverageTime = 0;
  switch (CHAIN.id) {
    // ref: https://arbiscan.io/chart/blocktime
    case ChainId.ARBITRUM_ONE:
      blockAverageTime = 260;
      break;
    // ref: https://snowtrace.io/chart/blocktime
    case ChainId.AVALANCHE:
      blockAverageTime = 2000;
      break;
    // ref: https://bscscan.com/chart/blocktime
    case ChainId.BNB_CHAIN:
      blockAverageTime = 3000;
      break;
  }

  return blockAverageTime * 0.9;
};
export const BLOCK_INTERVAL_CACHE_TIME: number = parseEnvToInt('BLOCK_INTERVAL_CACHE_TIME', {
  default: getDefaultBlockIntervalCache(),
});
