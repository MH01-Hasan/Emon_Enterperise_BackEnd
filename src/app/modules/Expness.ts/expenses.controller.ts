import { Request, Response } from 'express';
import catchasync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ExpenseService } from './expenses.service';
import { IExpense } from './expenses.interface';
import { ExpensesFilterFields } from './expenses.conts';
import pick from '../../../shared/pick';
import { pagination } from '../../../conostans/pagination';


// ..........................Create Expense.............................................
const createExpense = catchasync(async (req: Request, res: Response) => {
  const event = req.body;
  const result = await ExpenseService.createExpense(event);
  console.log(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully created Expense',
    data: result,
  });
});

const getAllExpenses = catchasync(async (req: Request, res: Response) => {
  const filtering = pick(req.query, ExpensesFilterFields);
  const result = await ExpenseService.getAllExpenses(
    filtering 
  );

  sendResponse<IExpense[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All Expense data',
    meta: result.meta,
    data: result.data,
  });
});

// // ..........................Get single Employee.............................................
// const getSingleEmployee = catchasync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).json({ message: 'ID is required' });
//   }
//   const result = await EmployeeService.getSingleEmployee(id);

//   sendResponse<IEmployee>(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Employee Data',
//     data: result,
//   });
// });

// // ..........................Update Employee.............................................
// const updateEmployee = catchasync(async (req: Request, res: Response) => {
//   const id: string = req.params.id;
//   const updatedata = req.body;

//   const result = await EmployeeService.updateEmployee(id, updatedata);
//   sendResponse<IEmployee>(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Employee Data Successfully Updated',
//     data: result,
//   });
// });

// // ...........................Delete Employee.............................................
// const deleteEmployee = catchasync(async (req: Request, res: Response) => {
//   const id: string = req.params.id;
//   const result = await EmployeeService.deleteEmployee(id);
//   sendResponse<IEmployee>(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Deleted Employee Data Successfully',
//     data: result,
//   });
// });

export const ExpenseController = {
  createExpense,
  getAllExpenses,
  // createEmployee,
  // getAllEmployees,
  // getSingleEmployee,
  // updateEmployee,
  // deleteEmployee,
};
