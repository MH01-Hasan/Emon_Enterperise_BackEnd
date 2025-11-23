import { Request, Response } from 'express';
import catchasync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { pagination } from '../../../conostans/pagination';
import { EmployeeService } from './employee.service';
import { IEmployee } from './employee.interface';
import { EmployeeFilterFields } from './employee.conts';

// ..........................Create Employee.............................................
const createEmployee = catchasync(async (req: Request, res: Response) => {
  const event = req.body;
  const result = await EmployeeService.createEmployee(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully created Employee',
    data: result,
  });
});

const getAllEmployees = catchasync(async (req: Request, res: Response) => {
  const filtering = pick(req.query, EmployeeFilterFields);
  const PaginationObject = pick(req.query, pagination);
  const result = await EmployeeService.getAllEmployees(
    filtering,
    PaginationObject
  );

  sendResponse<IEmployee[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All Employee data',
    meta: result.meta,
    data: result.data,
  });
});

// ..........................Get single Employee.............................................
const getSingleEmployee = catchasync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  const result = await EmployeeService.getSingleEmployee(id);

  sendResponse<IEmployee>(res, {
    statusCode: 200,
    success: true,
    message: 'Employee Data',
    data: result,
  });
});

// ..........................Update Employee.............................................
const updateEmployee = catchasync(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const updatedata = req.body;

  const result = await EmployeeService.updateEmployee(id, updatedata);
  sendResponse<IEmployee>(res, {
    statusCode: 200,
    success: true,
    message: 'Employee Data Successfully Updated',
    data: result,
  });
});

// ...........................Delete Employee.............................................
const deleteEmployee = catchasync(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result = await EmployeeService.deleteEmployee(id);
  sendResponse<IEmployee>(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted Employee Data Successfully',
    data: result,
  });
});

export const EmployeeController = {
  createEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
};
