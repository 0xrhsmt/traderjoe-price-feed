import { ChainId, Token } from '@traderjoe-xyz/sdk-core';

export const avalanche = {
  WAVAX: new Token(
    ChainId.AVALANCHE,
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    18,
    'Wrapped AVAX',
    'WAVAX',
  ),
  USDC: new Token(
    ChainId.AVALANCHE,
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    6,
    'USD Coin',
    'USDC',
  ),
  LINK: new Token(
    ChainId.AVALANCHE,
    '0x5947BB275c521040051D82396192181b413227A3',
    18,
    'Chainlink Token',
    'LINK.e',
  ),
  GMX: new Token(ChainId.AVALANCHE, '0x62edc0692BD897D2295872a9FFCac5425011c661', 18, 'GMX', 'GMX'),

  v1: {
    WAVAX_USDC_PAIR: {
      address: '0xf4003F4efBE8691B60249E6afbD307aBE7758adb',
    },
  },
  v2: {
    WAVAX_USDC_20_PAIR: {
      address: '0xB5352A39C11a81FE6748993D586EC448A01f08b5',
    },
  },
  v2_1: {
    WAVAX_USDC_20_PAIR: {
      address: '0xD446eb1660F766d533BeCeEf890Df7A69d26f7d1',
    },
  },
};

export const arbitrum = {
  USDT: new Token(
    ChainId.ARBITRUM_ONE,
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    6,
    'USDT',
    'Tether Token',
  ),
  USDC: new Token(
    ChainId.ARBITRUM_ONE,
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    6,
    'USDC',
    'USD Coin',
  ),
  v1: {
    USDT_USDC_PAIR: {
      address: '0x65514798aa1DFF22C0A8bbaDb6b5d3e49b3732Fe',
    },
  },
  v2: {},
  v2_1: {},
};
