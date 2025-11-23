import { z } from 'zod';

const LoginZodSchema = z.object({
  body: z.object({ 
  email: z.string({
      required_error: 'Email is required',
  }),

   
    password: z.string({
      required_error: 'Password is required',
    }),
  }),


});



const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});


const ChangePasswordTokenZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old Password is required',
    }),
    NewPassword: z.string({
      required_error: 'New Password is required',
    }),
  }),
});

export const Authvalidation = {
  LoginZodSchema,
  refreshTokenZodSchema,
  ChangePasswordTokenZodSchema,
};
