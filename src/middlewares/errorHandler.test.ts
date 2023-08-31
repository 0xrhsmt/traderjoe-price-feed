import { describe, expect, it } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import {
  ClientErrorCodes,
  InternalServerError,
  NotFoundError,
  RequestInputValidationError,
  RequestTimeoutError,
} from '../errors';
import { generateErrorBody } from './errorHandler';
import { z } from 'zod';

describe('generateErrorBody', () => {
  it('returns an error body for a plain error', () => {
    const error = new Error('test');
    const body = generateErrorBody(error);

    expect(body).toEqual({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorBody: {
        reason: 'Internal Server Error',
      },
    });
  });

  it('returns an error body for a RequestInputValidationError', () => {
    const zodError = new z.ZodError([]);
    const error = new RequestInputValidationError(zodError);
    const body = generateErrorBody(error);

    expect(body).toEqual({
      statusCode: StatusCodes.BAD_REQUEST,

      errorBody: {
        code: ClientErrorCodes.RequestInputValidationError,
        reason: 'Bad Request',
        validationErrors: {
          fieldErrors: {},
          formErrors: [],
        },
      },
    });
  });

  it('returns an error body for a RequestTimeoutError', () => {
    const error = new RequestTimeoutError();
    const body = generateErrorBody(error);

    expect(body).toEqual({
      statusCode: StatusCodes.REQUEST_TIMEOUT,
      errorBody: {
        code: ClientErrorCodes.RequestTimeoutError,
        reason: 'Request Timeout',
      },
    });
  });

  it('returns an error body for a NotFoundError', () => {
    const error = new NotFoundError();
    const body = generateErrorBody(error);

    expect(body).toEqual({
      statusCode: StatusCodes.NOT_FOUND,
      errorBody: {
        code: ClientErrorCodes.NotFoundError,
        reason: 'Not Found',
      },
    });
  });

  it('returns an error body for a InternalServerError', () => {
    const error = new InternalServerError();
    const body = generateErrorBody(error);

    expect(body).toEqual({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorBody: {
        reason: 'Internal Server Error',
      },
    });
  });
});
