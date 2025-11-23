import express from 'express';
import validateRequest from '../../middelware/validateRequest';
import auth from '../../middelware/auth';
import { EmployeeController } from './employee.controller';
import { EmployeeValidation } from './employee.validation';

const router = express.Router();

router.delete(
  '/:id',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
  EmployeeController.deleteEmployee
);

router.patch(
  '/:id',
  validateRequest(EmployeeValidation.UpdateEmployeeZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
  EmployeeController.updateEmployee
);

router.get(
  '/:id',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  EmployeeController.getSingleEmployee
);

router.post(
  '/',
  validateRequest(EmployeeValidation.CreateEmployeeZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN),
  EmployeeController.createEmployee
);

router.get(
  '/',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  EmployeeController.getAllEmployees
);

export const EmployeeRoutes = router;