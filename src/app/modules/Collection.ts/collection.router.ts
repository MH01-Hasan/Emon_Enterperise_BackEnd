import express from 'express';
import { CollectionController } from './collection.controller';
import cleanExpenseData from '../../middelware/cleaendata';


const router = express.Router();

router.post(
  '/',
  cleanExpenseData,
  // validateRequest(ExpenseValidation.CreateExpenseZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN),
  CollectionController.createCollection
);

router.get(
  '/',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  CollectionController.getAllCollections
);

export const CollectionRoutes = router;