import { arbitrum, avalanche, bsc, Chain } from 'viem/chains';

import { parseEnvToInt } from '../utils/index.js';
import { ChainId } from '@traderjoe-xyz/sdk-core';
import { ConfigurationError } from '../errors.js';

export const CHAIN_ID = parseEnvToInt('CHAIN_ID', { default: avalanche.id });

export const CHAIN: Chain = (() => {
  const getChain = (chainId: number) => {
    switch (chainId) {
      case ChainId.ARBITRUM_ONE:
        return arbitrum;
      case ChainId.AVALANCHE:
        return avalanche;
      case ChainId.BNB_CHAIN:
        return bsc;
    }
  };

  const chain = getChain(CHAIN_ID);
  if (!chain) {
    throw new ConfigurationError(`Invalid chain id: ${CHAIN_ID}`);
  }

  return chain;
})();
