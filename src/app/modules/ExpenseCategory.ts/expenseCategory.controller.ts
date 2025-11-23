import { Request, Response } from 'express';
import catchasync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { pagination } from '../../../conostans/pagination';
import { ExpenseCategoryService } from './expenseCategory.service';
import { IExpenseCategory } from './expenseCategory.interface';
import { ExpenseCategoryFilterFields } from './expenseCategory.conts';

// ..........................Create ExpenseCategory.............................................
const createExpenseCategory = catchasync(async (req: Request, res: Response) => {
  const event = req.body;
  const result = await ExpenseCategoryService.createExpenseCategory(event);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully created ExpenseCategory',
    data: result,
  });
});

const getAllExpenseCategories = catchasync(async (req: Request, res: Response) => {
  const filtering = pick(req.query, ExpenseCategoryFilterFields);
  const PaginationObject = pick(req.query, pagination);
  const result = await ExpenseCategoryService.getAllExpenseCategories(
    filtering,
    PaginationObject
  );

  sendResponse<IExpenseCategory[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All ExpenseCategory data',
    meta: result.meta,
    data: result.data,
  });
});

// ..........................Get single ExpenseCategory.............................................
const getSingleExpenseCategory = catchasync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  const result = await ExpenseCategoryService.getSingleExpenseCategory(id);

  sendResponse<IExpenseCategory>(res, {
    statusCode: 200,
    success: true,
    message: 'ExpenseCategory Data',
    data: result,
  });
});

// ..........................Update ExpenseCategory.............................................
const updateExpenseCategory = catchasync(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const updatedata = req.body;

  console.log(id, updatedata);

  const result = await ExpenseCategoryService.updateExpenseCategory(id, updatedata);
  sendResponse<IExpenseCategory>(res, {
    statusCode: 200,
    success: true,
    message: 'ExpenseCategory Data Successfully Updated',
    data: result,
  });
});

// ...........................Delete ExpenseCategory.............................................
const deleteExpenseCategory = catchasync(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const result = await ExpenseCategoryService.deleteExpenseCategory(id);
  sendResponse<IExpenseCategory>(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted ExpenseCategory Data Successfully',
    data: result,
  });
});

export const ExpenseCategoryController = {
  createExpenseCategory,
  getAllExpenseCategories,
  getSingleExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
};
