import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middelware/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middelware/auth';
import { ENUM_USER_Role } from '../../../enums/user';

const router = express.Router();

router.post(
  '/createuser',
  validateRequest(UserValidation.creatuserZodSchima),
  // auth(ENUM_USER_Role.SUPER_ADMIN, ENUM_USER_Role.ADMIN),
  UserController.creatuser
);


router.get(
  '/:id',
  auth(
    ENUM_USER_Role.SUPER_ADMIN,
    ENUM_USER_Role.ADMIN,
    ENUM_USER_Role.USER
  
  ),
  UserController.getSinglleuser
);

router.patch(
  '/:id',
  //  validateRequest(ProductValidation.update),
  UserController.updateProfile
);

router.patch(
  '/updaterole/:email',
  // validateRequest(UserValidation.updateroleZodSchima),
  auth(ENUM_USER_Role.SUPER_ADMIN),
  UserController.updaterole
);


router.get(
  '/',
  auth(
    ENUM_USER_Role.SUPER_ADMIN,
    ENUM_USER_Role.ADMIN,
   
  ),
  UserController.getAllUsers
);



export const UserRoutes = router;
