import {describe, expect, it} from '@jest/globals';
import request from 'supertest';
import app from '.';

// TODO: refactor
export const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
export const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"


describe("Test the root path", () => {
    it("It should response the GET method", async () => {
        const response = await request(app).get(`/v1/prices/${WETH}/${USDC}`);
        expect(response.statusCode).toBe(200);
    });

    it("It should error response", async () => {
        const response = await request(app).get(`/v1/prices/0x/0x`);
        expect(response.statusCode).toBe(500);
    });

});