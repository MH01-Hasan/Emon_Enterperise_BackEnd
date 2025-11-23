import { RequestHandler } from 'express';
import catchasync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';

const loginUser: RequestHandler = catchasync(
  async (req: Request, res: Response) => {
    const { ...logindata } = req.body;
    
    const result = await AuthService.loginUser(logindata);
    const { refreshToken, ...others } = result;
    console.log('loginUser result:', result);

    ///  set responce token in cookie
    const cookieOptions = {
      secure: config.evn === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'user login success',
      data: others,
    });
  }
);






const changePassword: RequestHandler = catchasync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    const result = await AuthService.changePassword(user, passwordData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password change successfully',
      data: result,
    });
  }
);

const refresh_Token = catchasync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refresh_Token(refreshToken);

  ///  set responce token in cookie
  // const cookieOptions = {
  //   secure: config.evn === 'production',
  //   httpOnly: true,
  // };

  // res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'user login success',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refresh_Token,
  
};
