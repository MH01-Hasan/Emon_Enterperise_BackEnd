import { SortOrder } from 'mongoose';
import { Pagination_helper } from '../../../halper/paginationhelper';
import { IgenericResponse } from '../../../interface/common';
import { IpaginationObject } from '../../../interface/pagination';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { CollectionCategorySearchFields } from './collectionCategory.conts';
import { CollectionCategory } from './expenseCategory.model';
import { ICollectionCategory, ICollectionCategorySearch } from './expenseCategory.interface';

const createCollectionCategory = async (payload: ICollectionCategory): Promise<ICollectionCategory> => {
  const result = await CollectionCategory.create(payload);
  return result;
};

const getAllCollectionCategories = async (
  filtering: ICollectionCategorySearch,
  PaginationObject: IpaginationObject
): Promise<IgenericResponse<ICollectionCategory[]>> => {
  const { searchTerm, ...filterData } = filtering;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: CollectionCategorySearchFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    Pagination_helper.calculatePagination(PaginationObject);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const findCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await CollectionCategory.find(findCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await CollectionCategory.countDocuments(findCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCollectionCategory = async (id: string): Promise<ICollectionCategory> => {
  const result = await CollectionCategory.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CollectionCategory not found');
  }
  return result;
};

const updateCollectionCategory = async (id: string, payload: Partial<ICollectionCategory>) => {
  const isExist = await CollectionCategory.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CollectionCategory not found');
  }

  const result = await CollectionCategory.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteCollectionCategory = async (id: string): Promise<ICollectionCategory | null> => {
  const result = await CollectionCategory.findByIdAndDelete(id);
  return result;
};

export const CollectionCategoryService = {
  createCollectionCategory,
  getAllCollectionCategories,
  getSingleCollectionCategory,
  updateCollectionCategory,
  deleteCollectionCategory,
};