import { z } from 'zod';
// req validation
const creatuserZodSchima = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is Requred',
    }),
    email: z.string({
      required_error: 'email is Requred',
    }),
    password: z.string({
      required_error: 'password is Requred',
    }),
  
    role: z.string().optional(),
   

  }),
});


export const UserValidation = {
  creatuserZodSchima,
};
