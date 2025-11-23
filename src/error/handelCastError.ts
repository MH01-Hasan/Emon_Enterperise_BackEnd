import mongoose from 'mongoose';
import { IgenericErrormessage } from '../interface/error';

const handelCastError = (error: mongoose.Error.CastError) => {
  const errors: IgenericErrormessage[] = [
    {
      path: error.path,
      message: 'Invalid id',
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: 'Cast Error',
    errorMessage: errors,
  };
};

export default handelCastError;
