import express from 'express';
import validateRequest from '../../middelware/validateRequest';
import auth from '../../middelware/auth';
import { CollectionCategoryController } from './expenseCategory.controller';
import { CollectionCategoryValidation } from './expenseCategory.validation';


const router = express.Router();

router.delete(
  '/:id',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
  CollectionCategoryController.deleteCollectionCategory
);

router.patch(
  '/:id',
  validateRequest(CollectionCategoryValidation.UpdateCollectionCategoryZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.USER),
  CollectionCategoryController.updateCollectionCategory
);

router.get(
  '/:id',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  CollectionCategoryController.getSingleCollectionCategory
);

router.post(
  
  '/',
  validateRequest(CollectionCategoryValidation.CreateCollectionCategoryZodSchema),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN),
  CollectionCategoryController.createCollectionCategory
);

router.get(
  '/',
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN, ENUM_USER_Role.USER),
  CollectionCategoryController.getAllCollectionCategories
);

export const CollectionCategoryRoutes = router;