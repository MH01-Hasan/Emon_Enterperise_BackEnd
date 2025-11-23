
import httpStatus from 'http-status';
import { Iuser, IUserSearch, UserSearchvalue } from './user.interface';
import { User } from './user.madel';
import ApiError from '../../../error/ApiError';
import { IpaginationObject } from '../../../interface/pagination';
import { IgenericResponse } from '../../../interface/common';
import { Pagination_helper } from '../../../halper/paginationhelper';
import { SortOrder } from 'mongoose';



const createuser = async (
  user: Iuser
): Promise<Iuser | null> => {
  const newUser = await User.create(user);

  return newUser;
};


const getSinglleuser = async (id: string): Promise<Iuser> => {

  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  return result;
};


const updateProfile = async (id: string, payload: Partial<Iuser>) => {
  const isExist = await User.findById(id)
 if (!isExist) {
   throw new ApiError(httpStatus.NOT_FOUND, 'User can not find');
 }

 const {name , ...donnerdata } = payload;

 const updateStudentData: Partial<Iuser> = { ...donnerdata };
 // dainamic data handel
 if (name && Object.keys(name).length > 0) {
   Object.keys(name).forEach(key => {
     const namekey = `name.${key}`;
     (updateStudentData as any)[namekey] = name[key as keyof typeof name];
   });
 }
 const result = await User.findOneAndUpdate({ _id: id }, payload, {
   new: true,
 });
 return result;
};


const updaterole = async (email: string, payload: Partial<Iuser>) => {
  const isExist = await User.findOne({
    email
  })
 if (!isExist) {
   throw new ApiError(httpStatus.NOT_FOUND, 'User can not find');
 }

 const {name , ...donnerdata } = payload;

 const updateStudentData: Partial<Iuser> = { ...donnerdata };
 // dainamic data handel
 if (name && Object.keys(name).length > 0) {
   Object.keys(name).forEach(key => {
     const namekey = `name.${key}`;
     (updateStudentData as any)[namekey] = name[key as keyof typeof name];
   });
 }
 const result = await User.findOneAndUpdate({ email }, payload, {
    new: true,
  }); 
  return result;
}


const getAllUsers = async (
  filtering: IUserSearch,
  paginationObject: IpaginationObject
): Promise<IgenericResponse<Iuser[]>> => {
  const { searchTerm, ...filterData } = filtering;


  const andCondition = [];
  
    if (searchTerm) {
      andCondition.push({
        $or: UserSearchvalue.map(field => ({
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
      Pagination_helper.calculatePagination(paginationObject);
  
    const sortCondition: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
      sortCondition[sortBy] = sortOrder;
    }
  
    const findCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  
    const result = await User.find(findCondition)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments(findCondition);
  
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
};








export const UserService = {
  createuser,
  getSinglleuser,
  updateProfile,
  updaterole,
  getAllUsers,
};
