import { SortOrder } from 'mongoose';
import { Pagination_helper } from '../../../halper/paginationhelper';
import { IgenericResponse } from '../../../interface/common';
import { IpaginationObject } from '../../../interface/pagination';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { IExpenseCategory, IExpenseCategorySearch } from './expenseCategory.interface';
import { ExpenseCategory } from './expenseCategory.model';
import { ExpenseCategorySearchFields } from './expenseCategory.conts';

const createExpenseCategory = async (payload: IExpenseCategory): Promise<IExpenseCategory> => {
  const result = await ExpenseCategory.create(payload);
  return result;
};

const getAllExpenseCategories = async (
  filtering: IExpenseCategorySearch,
  PaginationObject: IpaginationObject
): Promise<IgenericResponse<IExpenseCategory[]>> => {
  const { searchTerm, ...filterData } = filtering;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: ExpenseCategorySearchFields.map(field => ({
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

  const result = await ExpenseCategory.find(findCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await ExpenseCategory.countDocuments(findCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleExpenseCategory = async (id: string): Promise<IExpenseCategory> => {
  const result = await ExpenseCategory.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExpenseCategory not found');
  }
  return result;
};

const updateExpenseCategory = async (id: string, payload: Partial<IExpenseCategory>) => {
  const isExist = await ExpenseCategory.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExpenseCategory not found');
  }

  const result = await ExpenseCategory.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteExpenseCategory = async (id: string): Promise<IExpenseCategory | null> => {
  const result = await ExpenseCategory.findByIdAndDelete(id);
  return result;
};

export const ExpenseCategoryService = {
  createExpenseCategory,
  getAllExpenseCategories,
  getSingleExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
};