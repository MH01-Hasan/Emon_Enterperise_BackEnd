import { IgenericErrormessage } from './error';

export type Igenericresponce = {
  statusCode: number;
  message: string;
  errorMessage: IgenericErrormessage[];
};

export type IgenericResponse<T> = {
  meta: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data: T;
};
