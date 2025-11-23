import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { User } from '../user/user.madel';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IchangePassword,
} from './auth.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../halper/jwtHelpers';
import bcrypt from 'bcrypt';

const loginUser = async ({ email, password }: ILoginUser): Promise<ILoginUserResponse> => {
  try {
    // Check if email and password are provided
    if (!email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required');
    }

    // Find the user by email
    const user = await User.findOne({ email });
    
    // User not found
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found with this email');
    }

    // Check if password matches
    const isPasswordMatch = await user.isPasswordMatch(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
    }

   

    // Create JWT tokens
    const { _id: userId, role } = user;
    const accessToken = jwtHelpers.createToken(
      { userId, role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      { userId, role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );
    await user.save();
    return { 
      accessToken, 
      refreshToken 
    };

  } catch (error) {
    console.error('Login error:', error);
    
    // If error is already an ApiError, just rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Default error
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Login failed. Please try again later');
  }
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IchangePassword
): Promise<void> => {
  const { oldPassword, NewPassword } = payload;
  //   creat instance
  const users = new User();

  // chack user exist
  console.log(user?.userId);
  const isUserexist = await users?.isUserExist(user?.userId);
  if (!isUserexist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not fund');
  }

  // chacking old Passwod and match

  if (
    isUserexist?.password &&
    !users?.isPasswordMatch(oldPassword, isUserexist?.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'old Password incorrect');
  }

  // hash password before
  const hashnewPassword = await bcrypt.hash(
    NewPassword,
    Number(config.bycrypt_salt_rounds)
  );

  ///update Password
  const updatedata = {
    password: hashnewPassword,
    PasswordChangeAt: new Date(),
  };
  await User.findOneAndUpdate({ id: user?.userId }, updatedata);
};


const refresh_Token = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  /// check user
  const { userId } = verifiedToken;
  const user = new User();
  const isUserexist = await user.isUserExist(userId) as { _id: string, role: string, password?: string };
  if (!isUserexist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found');
  }

  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserexist._id,
      role: isUserexist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};





export const AuthService = {
  loginUser,
  refresh_Token,
  changePassword,
};
