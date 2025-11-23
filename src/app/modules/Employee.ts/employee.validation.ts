import { z } from 'zod';

// Create Employee zod schema
const CreateEmployeeZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),
    department: z.string({
      required_error: 'department is required',
    }),
  
  }),
});

// Update Employee zod schema
const UpdateEmployeeZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    department: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

// Export Employee validation schemas
export const EmployeeValidation = {
  CreateEmployeeZodSchema,
  UpdateEmployeeZodSchema,
};
