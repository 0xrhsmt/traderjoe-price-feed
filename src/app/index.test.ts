import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '.';

// TODO: refactor
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
const BETS = "0xe26Ae3d881f3d5dEF58D795f611753804E7A6B26"

describe("Test the root path", () => {
    describe('v1', () => {
        it("It should response the GET method", async () => {
            const response = await request(app).get(`/v1/prices/${WETH}/${USDC}`);
            expect(response.statusCode).toBe(200);
        });

        it("It should error response", async () => {
            const response = await request(app).get(`/v1/prices/0x/0x`);
            expect(response.statusCode).toBe(500);
        });
    })

    describe('v2', () => {
        it("It should response the GET method", async () => {
            const response = await request(app).get(`/v2/prices/${WETH}/${BETS}/100`);
            expect(response.statusCode).toBe(200);
        });

        it("It should error response", async () => {
            const response = await request(app).get(`/v2/prices/0x/0x/0`);
            expect(response.statusCode).toBe(500);
        });
    })

    describe('v2_1', () => {
        it("It should response the GET method", async () => {
            const response = await request(app).get(`/v2_1/prices/${WETH}/${USDC}/15`);
            expect(response.statusCode).toBe(200);
        });

        it("It should error response", async () => {
            const response = await request(app).get(`/v2_1/prices/0x/0x/0`);
            expect(response.statusCode).toBe(500);
        });
    })
});