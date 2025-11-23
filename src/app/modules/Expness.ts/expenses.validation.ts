import { z } from 'zod';

// Create Expense zod schema
const CreateExpenseZodSchema = z.object({
  body: z.object({
    amount: z.number({
      required_error: 'amount is required',
    }),
    description: z.string({
      required_error: 'description is required',
    }),
    category: z.string({
      required_error: 'category is required',
    }),
    paymentMethod: z.string({
      required_error: 'paymentMethod is required',
    }),
    
    bankAccount: z.string().optional(),
    group: z.string().optional(),
    date: z.string().datetime().optional(), // Assuming ISO date string
  }),
});






// Update Expense zod schema
const UpdateExpenseZodSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    date: z.string().datetime().optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }),
});

// Export Expense validation schemas
export const ExpenseValidation = {
  CreateExpenseZodSchema,
  UpdateExpenseZodSchema,
};
