import { Schema, model, Model } from 'mongoose';
import { CollectionCategoryModel, ICollectionCategory } from './expenseCategory.interface';

export const CollectionCategorySchema = new Schema<ICollectionCategory, CollectionCategoryModel>(
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

export const CollectionCategory = model<ICollectionCategory, CollectionCategoryModel>('CollectionCategory', CollectionCategorySchema);
