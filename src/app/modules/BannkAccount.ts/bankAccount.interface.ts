import { Model } from "mongoose";

// Define the structure of a bank account object
export type IBankAccount = {
    name: string;
    balance: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
};

export type BankAccountModel = Model<IBankAccount, Record<string, unknown>>;

// Define the structure of a bank account search object
export type IBankAccountSearch = {
    searchTerm?: string;
    name?: string;
    status?: 'active' | 'inactive';
};