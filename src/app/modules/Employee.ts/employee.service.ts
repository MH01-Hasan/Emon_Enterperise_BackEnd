import { SortOrder } from 'mongoose';
import { Pagination_helper } from '../../../halper/paginationhelper';
import { IgenericResponse } from '../../../interface/common';
import { IpaginationObject } from '../../../interface/pagination';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';
import { IEmployee, IEmployeeSearch } from './employee.interface';
import { Employee } from './employee.model';
import { EmployeeSearchFields } from './employee.conts';

const createEmployee = async (payload: IEmployee): Promise<IEmployee> => {
  const result = await Employee.create(payload);
  return result;
};

const getAllEmployees = async (
  filtering: IEmployeeSearch,
  PaginationObject: IpaginationObject
): Promise<IgenericResponse<IEmployee[]>> => {
  const { searchTerm, ...filterData } = filtering;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: EmployeeSearchFields.map(field => ({
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

  const result = await Employee.find(findCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Employee.countDocuments(findCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleEmployee = async (id: string): Promise<IEmployee> => {
  const result = await Employee.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }
  return result;
};

const updateEmployee = async (id: string, payload: Partial<IEmployee>) => {
  const isExist = await Employee.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee not found');
  }

  const result = await Employee.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteEmployee = async (id: string): Promise<IEmployee | null> => {
  const result = await Employee.findByIdAndDelete(id);
  return result;
};

export const EmployeeService = {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
};