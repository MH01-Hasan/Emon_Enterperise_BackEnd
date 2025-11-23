import { Model } from "mongoose";

export type ICollectionCategory = {
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionCategoryModel = Model<ICollectionCategory, Record<string, unknown>>;

// Define the structure of a collection category search object
export type ICollectionCategorySearch = {
  searchTerm?: string;
  name?: string;
  status?: 'active' | 'inactive';
};