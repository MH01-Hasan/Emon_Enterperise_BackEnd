import { z } from 'zod';

// Create ExpenseCategory zod schema
const CreateExpenseCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is hello`` required',
    }),
  }),
});

// Update ExpenseCategory zod schema
const UpdateExpenseCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

// Export ExpenseCategory validation schemas
export const ExpenseCategoryValidation = {
  CreateExpenseCategoryZodSchema,
  UpdateExpenseCategoryZodSchema,
};
