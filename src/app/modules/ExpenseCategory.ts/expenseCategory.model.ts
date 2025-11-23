import { Schema, model, Model } from 'mongoose';
import { ExpenseCategoryModel, IExpenseCategory } from './expenseCategory.interface';

export const ExpenseCategorySchema = new Schema<IExpenseCategory, ExpenseCategoryModel>(
  {
    name: {
      type: String,
      required: true,

    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ExpenseCategory = model<IExpenseCategory, ExpenseCategoryModel>('ExpenseCategory', ExpenseCategorySchema);
