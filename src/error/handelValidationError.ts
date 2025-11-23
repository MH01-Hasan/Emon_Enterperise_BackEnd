import mongoose from 'mongoose';
import { IgenericErrormessage } from '../interface/error';
import { Igenericresponce } from '../interface/common';

const handelValidationError = (
  err: mongoose.Error.ValidationError
): Igenericresponce => {
  const errors: IgenericErrormessage[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage: errors,
  };
};

export default handelValidationError;
