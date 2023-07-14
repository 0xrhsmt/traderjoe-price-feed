import {describe, expect, it} from '@jest/globals';
import PriceFetcherV2_1Service from '.';

// TODO: refactor
const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
const WETH = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
const BIN_STEP = 15

describe("PriceFetcherV2Service", () => {
    it("should return a value greater than 0", async () => {
        const service = new PriceFetcherV2_1Service();
        const price = await service.execute(USDC, WETH, BIN_STEP);

        console.log(price)

        expect(price).toBeGreaterThanOrEqual(0);
    })

    it("should throw error when invalid address is passed", () => {
        const service = new PriceFetcherV2_1Service();
        expect(() => service.execute("0x", "0x", 0)).rejects.toThrowError()
    })
})