import { Model, Schema } from "mongoose";


export type ITransactionHistory = {
 bankAccount: Schema.Types.ObjectId;
 type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description?: string;
  date: Date;
};

export type TransactionHistoryModel = Model<ITransactionHistory, Record<string, unknown>>;