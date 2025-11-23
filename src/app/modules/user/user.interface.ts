import { Date, Model, Types } from 'mongoose';


export type ImageType = {
  url: string;
  mediaId: string | null;
  bytes: number | null;
  fileType: string | null;
  name: string;
};



export type Iuser = {
  name: string;
  password: string;
  email: string;
  role: string;
  
};

export type IUserSearch = {
  searchTerm?: string;
  role?: string;
  status?: string;
};



/// instance password
export type IUserMethods = {
  isUserExist(_id: string): Promise<Partial<Iuser> | null>;
  isPasswordMatch(
    givenPassword: string,
    savePassword: string
  ): Promise<boolean>;
};

export const UserSearchvalue = [ "role" ];

export const Userfillterfield = ['searchTerm', "role", ];





export type UserModel = Model<Iuser, Record<string, unknown>, IUserMethods>;
