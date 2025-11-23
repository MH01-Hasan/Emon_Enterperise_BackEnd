import express from 'express';
import validateRequest from '../../middelware/validateRequest';
import { Authvalidation } from './auth.validations';
import { AuthController } from './auth.controller';
import auth from '../../middelware/auth';
import { ENUM_USER_Role } from '../../../enums/user';

const router = express.Router();

router.post(
  '/login',
  validateRequest(Authvalidation.LoginZodSchema),
  AuthController.loginUser
);
router.post(
  '/refresh-token',
  validateRequest(Authvalidation.refreshTokenZodSchema),
  AuthController.refresh_Token
);
router.post(
  '/change-password',
  validateRequest(Authvalidation.ChangePasswordTokenZodSchema),
  auth(
    ENUM_USER_Role.SUPER_ADMIN
  ),
  AuthController.changePassword
);

export const AuthRoutes = router;
