import { model, Schema,  } from 'mongoose';
import { ExpenseModel, IExpense } from './expenses.interface';

export const ExpenseSchema = new Schema<IExpense, ExpenseModel>(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'ExpenseCategory',
    },
    bankAccount: {
      type: Schema.Types.ObjectId,
      ref: 'BankAccount',
      default: null, // Set default to null instead of empty string
    },
    description: {
      type: String,
     
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Expense = model<IExpense, ExpenseModel>('Expense', ExpenseSchema);
