import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../error/ApiError';
import { jwtHelpers } from '../../halper/jwtHelpers';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        // Wait for 1 second before responding
        await new Promise(resolve => setTimeout(resolve, 1000));
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized'));
      }
      // verify token
      let verifiedUser;
      try {
        verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
        req.user = verifiedUser; // role , userid
      } catch (error) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
      }

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
