import { Response } from 'express';

type Iapiresponse<T> = {
  statusCode: number;
  success: boolean;
  message: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  } | null;
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: Iapiresponse<T>): void => {
  const jsondata: Iapiresponse<T> = {
    statusCode: data?.statusCode,
    success: data?.success,
    message: data?.message || null,
    meta: data?.meta || null,
    data: data.data || null,
  };
  res.status(data.statusCode).json(jsondata);
};

export default sendResponse;
