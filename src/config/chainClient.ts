import { PublicClient, createPublicClient, createTestClient, http, publicActions } from 'viem';

import { API_TIME_OUT } from './server.js';
import { foundry } from 'viem/chains';
import { CHAIN } from './chain.js';

const JSON_RPC_URL = process.env.JSON_RPC_URL ?? null;

let chainClient: PublicClient;
if (foundry.rpcUrls.default.http[0] !== JSON_RPC_URL) {
  chainClient = createPublicClient({
    chain: CHAIN,
    transport: http(JSON_RPC_URL ?? '', {
      batch: true,
      timeout: API_TIME_OUT,
    }),
  });
} else {
  const testClient = createTestClient({
    chain: CHAIN,
    mode: 'anvil',
    transport: http(foundry.rpcUrls.default.http[0], {
      batch: true,
      timeout: API_TIME_OUT,
    }),
  }).extend(publicActions);

  chainClient = testClient;
}

export { chainClient };
