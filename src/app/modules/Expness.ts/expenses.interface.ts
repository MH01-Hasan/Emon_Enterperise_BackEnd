import mongoose, { Model } from "mongoose";

// Define the structure of an expense object
export type IExpense = {
  date: Date;
  amount: number;
  category: mongoose.Types.ObjectId;
  bankAccount?: mongoose.Types.ObjectId | null; 
  description?: string;
  paymentMethod: string;
  group?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseModel = Model<IExpense, Record<string, unknown>>;

// Define the structure of an expense search object
export type IExpenseSearch = {
  category?: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  
};