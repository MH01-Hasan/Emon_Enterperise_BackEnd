import { ErrorRequestHandler } from 'express';
import config from '../../config';
import { IgenericErrormessage } from '../../interface/error';
import handelValidationError from '../../error/handelValidationError';
import ApiError from '../../error/ApiError';
import { errorlogger } from '../../shared/Logger';
import { ZodError } from 'zod';
import handelZodError from '../../error/handelZodError';
import handelCastError from '../../error/handelCastError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globelErrorHandlers: ErrorRequestHandler = (error, req, res, next) => {
  config.evn === 'development'
    ? console.log('Global error Handel', error)
    : errorlogger.error('Global error Handel', error);

  let statusCode = 500;
  let message = 'Something Went Wrong !';
  let errorMessage: IgenericErrormessage[] = [];

  if (error.name === 'ValidationError') {
    const simplyerror = handelValidationError(error);
    statusCode = simplyerror.statusCode;
    message = simplyerror.message;
    errorMessage = simplyerror.errorMessage;
  } else if (error instanceof ZodError) {
    const simplyerror = handelZodError(error);
    statusCode = simplyerror.statusCode;
    message = simplyerror.message;
    errorMessage = simplyerror.errorMessage;
  } else if (error?.name === 'CastError') {
    const simplyerror = handelCastError(error);
    statusCode = simplyerror.statusCode;
    message = simplyerror.message;
    errorMessage = simplyerror.errorMessage;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.evn !== 'production' ? error?.stack : undefined,
  });
};

export default globelErrorHandlers;
