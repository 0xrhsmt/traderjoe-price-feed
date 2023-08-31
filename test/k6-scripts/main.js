/* eslint-disable no-undef */
import { v1Prices } from './v1-prices.js';
import { v2Prices } from './v2-prices.js';
import { v2_1Prices } from './v2-1-prices.js';
import { v1BatchPrices } from './v1-batch-prices.js';
import { v2BatchPrices } from './v2-batch-prices.js';
import { v2_1BatchPrices } from './v2-1-batch-prices.js';
import { thresholdsSettings, breakingWorkload, smokeWorkload, spikeWorkload } from './config.js';

export const options = {
  scenarios: {
    my_scenario:
      __ENV.WORKLOAD === 'breaking'
        ? breakingWorkload
        : __ENV.WORKLOAD === 'spike'
        ? spikeWorkload
        : smokeWorkload,
  },
  thresholds: thresholdsSettings,
};

const baseUrl = 'http://localhost:3000';
const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7';
const USDC = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
const v1Pairs = ['0xf4003F4efBE8691B60249E6afbD307aBE7758adb'];
const v2Pairs = ['0xB5352A39C11a81FE6748993D586EC448A01f08b5'];
const v2_1Pairs = ['0xD446eb1660F766d533BeCeEf890Df7A69d26f7d1'];

export default function () {
  v1Prices(baseUrl, WAVAX, USDC);
  v2Prices(baseUrl, WAVAX, USDC, 20);
  v2_1Prices(baseUrl, WAVAX, USDC, 20);
  v1BatchPrices(baseUrl, v1Pairs);
  v2BatchPrices(baseUrl, v2Pairs);
  v2_1BatchPrices(baseUrl, v2_1Pairs);
}
