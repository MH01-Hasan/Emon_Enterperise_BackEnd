import express from 'express';
import validateRequest from '../../middelware/validateRequest';
import { ExpenseController } from './expenses.controller';
import { ExpenseValidation } from './expenses.validation';
import cleanExpenseData from '../../middelware/cleaendata';

// import { EmployeeController } from './employee.controller';
// import { EmployeeValidation } from './employee.validation';

const router = express.Router();

// router.delete(
//   '/:id',
//   // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
//   EmployeeController.deleteEmployee
// );

// router.patch(
//   '/:id',
//   validateRequest(EmployeeValidation.UpdateEmployeeZodSchema),
//   // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
//   EmployeeController.updateEmployee
// );

// router.get(
//   '/:id',
//   // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
//   EmployeeController.getSingleEmployee
// );


router.post(
  '/',
  cleanExpenseData,
  // validateRequest(ExpenseValidation.CreateExpenseZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN),
  ExpenseController.createExpense
);

router.get(
  '/',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  ExpenseController.getAllExpenses
);

export const ExpenseRoutes = router;