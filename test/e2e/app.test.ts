import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { ClientErrorCodes } from '../../src/errors.js';
import { avalanche } from '../utils/index.js';
import { app } from '../../src/app.js';

describe('app', () => {
  describe('GET /', () => {
    it('responds with a not-found error', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        code: ClientErrorCodes.NotFoundError,
        reason: 'Not Found',
      });
    });
  });

  describe('POST /', () => {
    it('responds with a not-found error', async () => {
      const response = await request(app).post('/').send([]);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        code: ClientErrorCodes.NotFoundError,
        reason: 'Not Found',
      });
    });
  });

  describe('GET /v1/prices/:base/:quote', () => {
    describe('when input is valid', () => {
      it('responds with a price', async () => {
        const response = await request(app).get(
          `/v1/prices/${avalanche.WAVAX.address}/${avalanche.USDC.address}`,
        );

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toEqual({
          price: {
            pair_address: expect.any(String),
            base_address: expect.any(String),
            quote_address: expect.any(String),
            price: expect.any(Number),
          },
        });
      });
    });

    describe('when input is invalid', () => {
      it('responds with a validation error when the "base" params is "0x"', async () => {
        const response = await request(app).get(`/v1/prices/0x/${avalanche.USDC.address}`);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain('Invalid address');
      });
    });
  });

  describe('POST  /v1/batch-prices', () => {
    describe('when input is valid', () => {
      it('responds with prices', async () => {
        const response = await request(app)
          .post('/v1/batch-prices')
          .send([avalanche.v1.WAVAX_USDC_PAIR.address]);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.prices).toEqual(
          expect.arrayContaining([
            {
              pair_address: expect.any(String),
              base_address: expect.any(String),
              quote_address: expect.any(String),
              price: expect.any(Number),
            },
          ]),
        );
        expect(response.body.prices.length).toBe(1);
      });
    });

    describe('when input is invalid', () => {
      it('responds with a validation error when the "pairs" params is empty', async () => {
        const response = await request(app).post('/v1/batch-prices').send([]);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain(
          'Array must contain at least 1 element(s)',
        );
      });
      it('responds with a validation error when the "pairs" parameter includes "0x"', async () => {
        const response = await request(app).post('/v1/batch-prices').send(['0x']);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain('Invalid address');
      });
    });
  });

  describe('GET /v2/prices/:base/:quote/:binstep', () => {
    describe('when input is valid', () => {
      it('responds with a price', async () => {
        const response = await request(app).get(
          `/v2/prices/${avalanche.WAVAX.address}/${avalanche.USDC.address}/20`,
        );

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toEqual({
          price: {
            pair_address: expect.any(String),
            base_address: expect.any(String),
            quote_address: expect.any(String),
            binstep: expect.any(Number),
            price: expect.any(Number),
          },
        });
      });
    });

    describe('when input is invalid', () => {
      it('responds with a validation error when the "base" params is 0x', async () => {
        const response = await request(app).get(`/v2/prices/0x/${avalanche.USDC.address}/20`);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain('Invalid address');
      });

      it('responds with a validation error when the "binstep" params is 0', async () => {
        const response = await request(app).get(
          `/v2/prices/${avalanche.WAVAX.address}/${avalanche.USDC.address}/0`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain(
          'Number must be greater than 0',
        );
      });
    });
  });

  describe('POST /v2/batch-prices', () => {
    describe('when input is valid', () => {
      it('responds with prices', async () => {
        const response = await request(app)
          .post('/v2/batch-prices')
          .send(['0xB5352A39C11a81FE6748993D586EC448A01f08b5']);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.prices).toEqual(
          expect.arrayContaining([
            {
              pair_address: expect.any(String),
              base_address: expect.any(String),
              quote_address: expect.any(String),
              binstep: expect.any(Number),
              price: expect.any(Number),
            },
          ]),
        );
        expect(response.body.prices.length).toBe(1);
      });
    });

    describe('when input is invalid', () => {
      it('responds with a validation error when the "pairs" params is empty', async () => {
        const response = await request(app).post('/v2/batch-prices').send([]);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain(
          'Array must contain at least 1 element(s)',
        );
      });
      it('responds with a validation error when the "pairs" params includes 0x', async () => {
        const response = await request(app).post('/v2/batch-prices').send(['0x']);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain('Invalid address');
      });
    });
  });

  describe('GET /v2_1/prices/:base/:quote/:binstep', () => {
    describe('when input is valid', () => {
      it('responds with a price', async () => {
        const response = await request(app).get(
          `/v2_1/prices/${avalanche.WAVAX.address}/${avalanche.USDC.address}/20`,
        );

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toEqual({
          price: {
            pair_address: expect.any(String),
            base_address: expect.any(String),
            quote_address: expect.any(String),
            binstep: expect.any(Number),
            price: expect.any(Number),
          },
        });
      });
    });

    describe('when input is invalid', () => {
      it('responds with a validation error when the "base" params is 0x', async () => {
        const response = await request(app).get(`/v2_1/prices/0x/${avalanche.USDC.address}/20`);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain('Invalid address');
      });

      it('responds with a validation error when the "bitstep" params is zero', async () => {
        const response = await request(app).get(
          `/v2_1/prices/${avalanche.WAVAX.address}/${avalanche.USDC.address}/0`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain(
          'Number must be greater than 0',
        );
      });
    });
  });

  describe('POST /v2_1/batch-prices', () => {
    describe('when input is valid', () => {
      it('responds with prices', async () => {
        const response = await request(app)
          .post('/v2_1/batch-prices')
          .send(['0xD446eb1660F766d533BeCeEf890Df7A69d26f7d1']);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.prices).toEqual(
          expect.arrayContaining([
            {
              pair_address: expect.any(String),
              base_address: expect.any(String),
              quote_address: expect.any(String),
              binstep: expect.any(Number),
              price: expect.any(Number),
            },
          ]),
        );
        expect(response.body.prices.length).toBe(1);
      });
    });

    describe('when input is invalid', () => {
      it('responds with a validation error when the "body" params is empty', async () => {
        const response = await request(app).post('/v2_1/batch-prices').send([]);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain(
          'Array must contain at least 1 element(s)',
        );
      });
      it('responds with a validation error when the "pair" params is 0x', async () => {
        const response = await request(app).post('/v2_1/batch-prices').send(['0x']);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.code).toBe(ClientErrorCodes.RequestInputValidationError);
        expect(JSON.stringify(response.body.validationErrors)).toContain('Invalid address');
      });
    });
  });
});
