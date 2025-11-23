import { SortOrder } from 'mongoose';

export type IpaginationObject = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};
