import express from 'express';
import validateRequest from '../../middelware/validateRequest';
import auth from '../../middelware/auth';
import { ExpenseCategoryController } from './expenseCategory.controller';
import { ExpenseCategoryValidation } from './expenseCategory.validation';

const router = express.Router();

router.delete(
  '/:id',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
  ExpenseCategoryController.deleteExpenseCategory
);

router.patch(
  '/:id',
  validateRequest(ExpenseCategoryValidation.UpdateExpenseCategoryZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
  ExpenseCategoryController.updateExpenseCategory
);

router.get(
  '/:id',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  ExpenseCategoryController.getSingleExpenseCategory
);

router.post(
  
  '/',
  validateRequest(ExpenseCategoryValidation.CreateExpenseCategoryZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN),
  ExpenseCategoryController.createExpenseCategory
);

router.get(
  '/',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  ExpenseCategoryController.getAllExpenseCategories
);

export const ExpenseCategoryRoutes = router;