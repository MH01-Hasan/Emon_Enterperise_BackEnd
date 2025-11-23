import mongoose, { Model } from "mongoose";


// Define the structure of a collection object
export type ICollection = {
    date: Date;
    amount: number;
    bankAccount?: mongoose.Types.ObjectId | null;
    category?: mongoose.Types.ObjectId| null;
    paymentMethod: string;
    employee?: mongoose.Types.ObjectId | null;
    description?: string;
    createdAt: Date;
    updatedAt: Date;

};


      

export type CollectionModel = Model<ICollection, Record<string, unknown>>;

// Define the structure of a collection search object
export type ICollectionSearch = {
    category?: string;
    searchTerm?: string;
    employee?: string;
    startDate?: string;
    endDate?: string;
    
};