import { Schema, model, Model } from 'mongoose';
import { BankAccountModel, IBankAccount } from './bankAccount.interface';



export const BankAccountSchema = new Schema<IBankAccount, BankAccountModel>(
  {
       name: { type: String, required: true, trim: true },
      balance: { type: Number, default: 0 },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const BankAccount = model<IBankAccount, BankAccountModel>('BankAccount', BankAccountSchema);
