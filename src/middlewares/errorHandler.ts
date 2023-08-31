import express from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ZodIssue } from 'zod';

import {
  BaseError,
  BaseClientError,
  ErrorBodyWithHTTPStatusCode,
  RequestInputValidationError,
} from '../errors.js';
import { logError } from './httpLogger.js';

const getErrorReason: (error: BaseError) => string = error => {
  return error.message || getReasonPhrase(error.statusCode);
};

const generateBadRequestError: (error: BaseClientError) => ErrorBodyWithHTTPStatusCode = error => {
  if (error instanceof RequestInputValidationError) {
    return {
      statusCode: error.statusCode,
      errorBody: {
        reason: getErrorReason(error),
        code: error.errorCode,
        validationErrors: error.zodError.flatten((issue: ZodIssue) => ({
          path: issue.path,
          reason: issue.message,
          code: issue.code,
        })),
      },
    };
  }

  return {
    statusCode: error.statusCode,
    errorBody: {
      reason: getErrorReason(error),
      code: error.errorCode,
    },
  };
};

export const generateErrorBody: (error: Error) => ErrorBodyWithHTTPStatusCode = error => {
  if (error instanceof BaseError) {
    if (error instanceof BaseClientError) {
      return generateBadRequestError(error);
    }

    return {
      statusCode: error.statusCode,
      errorBody: {
        reason: getErrorReason(error),
      },
    };
  }

  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    errorBody: {
      reason: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    },
  };
};

export const errorHandler: express.ErrorRequestHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  logError(res, error);

  const { statusCode, errorBody } = generateErrorBody(error);
  res.status(statusCode).json(errorBody);
};
