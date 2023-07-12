import {describe, expect, it} from '@jest/globals';
import PriceFetcherV1Service from '.';

// TODO: refactor
export const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
export const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"

describe("PriceFetcherV1Service", () => {
    it("should return a value greater than 0", async () => {
        const service = new PriceFetcherV1Service();
        const price = await service.execute(WETH, USDC);

        expect(price).toBeGreaterThanOrEqual(0);
    })

    it("should throw error when invalid address is passed", () => {
        const service = new PriceFetcherV1Service();
        expect(() => service.execute("0x", "0x")).rejects.toThrowError()
    })
})