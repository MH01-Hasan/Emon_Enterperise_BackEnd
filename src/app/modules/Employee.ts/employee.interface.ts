import { Model } from "mongoose";

// Define the structure of an employee object
export type IEmployee = {
  name: string;
  department: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeModel = Model<IEmployee, Record<string, unknown>>;

// Define the structure of an employee search object
export type IEmployeeSearch = {
  searchTerm?: string;
  name?: string;
  department?: string;
  status?: 'active' | 'inactive';
};