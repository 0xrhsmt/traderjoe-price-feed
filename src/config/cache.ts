import { ChainId } from '@traderjoe-xyz/sdk-core';
import { CHAIN } from './chain.js';

const BLOCK_INTERVAL_MULTIPLIER = 0.75;

const getBlockIntervalAverage = () => {
  switch (CHAIN.id) {
    // ref: https://arbiscan.io/chart/blocktime
    case ChainId.ARBITRUM_ONE:
      return 260;

    // ref: https://snowtrace.io/chart/blocktime
    case ChainId.AVALANCHE:
      return 2000;

    // ref: https://bscscan.com/chart/blocktime
    case ChainId.BNB_CHAIN:
      return 3000;
    default:
      return 0;
  }
};
export const BLOCK_INTERVAL_CACHE_TIME: number =
  getBlockIntervalAverage() * BLOCK_INTERVAL_MULTIPLIER;
