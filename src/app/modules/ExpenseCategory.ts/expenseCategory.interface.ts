import { Model } from "mongoose";

export type IExpenseCategory = {
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseCategoryModel = Model<IExpenseCategory, Record<string, unknown>>;

// Define the structure of an expense category search object
export type IExpenseCategorySearch = {
  searchTerm?: string;
  name?: string;
  status?: 'active' | 'inactive';
};