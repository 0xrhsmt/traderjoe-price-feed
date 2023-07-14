import {describe, expect, it} from '@jest/globals';
import PriceFetcherV2Service from '.';

// TODO: refactor
const BETS = "0xe26Ae3d881f3d5dEF58D795f611753804E7A6B26"
const WETH = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
const BIN_STEP = 100

describe("PriceFetcherV2Service", () => {
    it("should return a value greater than 0", async () => {
        const service = new PriceFetcherV2Service();
        const price = await service.execute(BETS, WETH, BIN_STEP);

        expect(price).toBeGreaterThanOrEqual(0);
    })

    it("should throw error when invalid address is passed", () => {
        const service = new PriceFetcherV2Service();
        expect(() => service.execute("0x", "0x", 0)).rejects.toThrowError()
    })
})