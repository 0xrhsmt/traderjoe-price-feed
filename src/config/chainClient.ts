import { PublicClient, createPublicClient, createTestClient, http, publicActions } from 'viem';

import { TIME_OUT } from './server.js';
import { foundry } from 'viem/chains';
import { CHAIN } from './chain.js';

const JSON_RPC_URL = process.env.JSON_RPC_URL ?? null;
const ANVIL_MODE = process.env.ANVIL_MODE === 'true';
const ANVIL_MODE_FORK_BLOCK_NUMBER = 34548420;

export const chainClient: PublicClient = (() => {
  if (!ANVIL_MODE) {
    return createPublicClient({
      chain: CHAIN,
      transport: http(JSON_RPC_URL ?? '', {
        batch: true,
        timeout: TIME_OUT,
      }),
    });
  } else {
    const testClient = createTestClient({
      chain: CHAIN,
      mode: 'anvil',
      transport: http(foundry.rpcUrls.default.http[0], {
        batch: true,
        timeout: TIME_OUT,
      }),
    }).extend(publicActions);
    testClient.reset({
      blockNumber: BigInt(ANVIL_MODE_FORK_BLOCK_NUMBER),
    });

    return testClient;
  }
})();
