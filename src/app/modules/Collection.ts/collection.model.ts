import { model, Schema,  } from 'mongoose';
import { CollectionModel, ICollection } from './collection.interface';

export const CollectionSchema = new Schema<ICollection, CollectionModel>(

    {
        date: {
                type: Date,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            bankAccount: {
                type: Schema.Types.ObjectId,
                ref: 'BankAccount',
                default: null, 
            },
            category: {
                type: Schema.Types.ObjectId,
                ref: 'CollectionCategory',
                default: null,
            },
            paymentMethod: {
                type: String,

                required: true,
                trim: true,
            },
            employee: {
                type: Schema.Types.ObjectId,
                ref: 'Employee',
                default: null,
            },
            description: {
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

export const Collection = model<ICollection, CollectionModel>('Collection', CollectionSchema);
