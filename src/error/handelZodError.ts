import { ZodError, ZodIssue } from 'zod';
import { Igenericresponce } from '../interface/common';
import { IgenericErrormessage } from '../interface/error';

const handelZodError = (error: ZodError): Igenericresponce => {
  const errors: IgenericErrormessage[] = error.issues.map(
    (issuse: ZodIssue) => {
      return {
        path: issuse?.path[issuse.path.length - 1],
        message: issuse?.message,
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

export default handelZodError;
