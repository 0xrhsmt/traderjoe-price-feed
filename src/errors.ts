import { StatusCodes } from 'http-status-codes';
import z, { ZodError } from 'zod';

export enum ClientErrorCodes {
  RequestInputValidationError = 100,
  NotFoundError = 101,
  RequestTimeoutError = 102,
  TooManyRequestsError = 103,
  PairNoLiquidityError = 104,
  TokenInfoFetchError = 105,
  PairInfoFetchError = 106,
}

export abstract class BaseError extends Error {
  public abstract statusCode: number;
}

export abstract class BaseClientError extends BaseError {
  public abstract errorCode: ClientErrorCodes;
}
export class RequestInputValidationError extends BaseClientError {
  public statusCode = StatusCodes.BAD_REQUEST;
  public errorCode = ClientErrorCodes.RequestInputValidationError;
  public zodError: ZodError;

  constructor(_zodError: ZodError, message?: string) {
    super(message, { cause: _zodError });

    this.zodError = _zodError;
  }
}
export class RequestTimeoutError extends BaseClientError {
  public statusCode = StatusCodes.REQUEST_TIMEOUT;
  public errorCode = ClientErrorCodes.RequestTimeoutError;

  constructor(message?: string, options?: ErrorOptions) {
    super(message || 'Request Timeout', options);
  }
}
export class TooManyRequestsError extends BaseClientError {
  public statusCode = StatusCodes.TOO_MANY_REQUESTS;
  public errorCode = ClientErrorCodes.TooManyRequestsError;

  constructor(message?: string, options?: ErrorOptions) {
    super(message || 'Too many requests, please try again later', options);
  }
}
export class PairNoLiquidityError extends BaseClientError {
  public statusCode = StatusCodes.BAD_REQUEST;
  public errorCode = ClientErrorCodes.PairNoLiquidityError;

  constructor(message?: string, options?: ErrorOptions) {
    super(message || 'Pair no liquidity', options);
  }
}
export class TokenInfoFetchError extends BaseClientError {
  public statusCode = StatusCodes.BAD_REQUEST;
  public errorCode = ClientErrorCodes.TokenInfoFetchError;

  constructor(message?: string, options?: ErrorOptions) {
    super(
      message || 'Failed to fetch token information. The wrong token address maybe be specified.',
      options,
    );
  }
}
export class PairInfoFetchError extends BaseClientError {
  public statusCode = StatusCodes.BAD_REQUEST;
  public errorCode = ClientErrorCodes.PairInfoFetchError;

  constructor(message?: string, options?: ErrorOptions) {
    super(
      message || 'Failed to fetch pair information. The wrong token address maybe be specified.',
      options,
    );
  }
}

export class NotFoundError extends BaseClientError {
  public statusCode = StatusCodes.NOT_FOUND;
  public errorCode = ClientErrorCodes.NotFoundError;
}

export abstract class BaseInternalServerError extends BaseError {
  public statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
}
export class InternalServerError extends BaseInternalServerError {}
export class ConfigurationError extends BaseInternalServerError {}
export class ParseError extends BaseInternalServerError {}

export interface ErrorBodyWithHTTPStatusCode {
  statusCode: StatusCodes;
  errorBody: ErrorBody;
}

export interface ErrorBody {
  reason: string;
  code?: number;
  validationErrors?: z.inferFlattenedErrors<z.ZodType, unknown>;
}

export type ValidationErrorIssue = {
  reason: string;
  code: string;
};
