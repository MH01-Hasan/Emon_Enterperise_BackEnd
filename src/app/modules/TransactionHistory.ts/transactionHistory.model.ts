import { Schema, model, Model } from 'mongoose';
import { ITransactionHistory } from './transactionHistory.interface';



export interface TransactionHistoryModel extends Model<ITransactionHistory> {}

export const TransactionHistorySchema = new Schema<ITransactionHistory, TransactionHistoryModel>(
    {
        bankAccount: { type: Schema.Types.ObjectId, ref: 'BankAccount', required: true },
        type: { type: String, required: true, enum: ['deposit', 'withdrawal', 'transfer'] },
        amount: { type: Number, required: true },
        description: { type: String, trim: true },
        date: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

export const TransactionHistory = model<ITransactionHistory, TransactionHistoryModel>('TransactionHistory', TransactionHistorySchema);
