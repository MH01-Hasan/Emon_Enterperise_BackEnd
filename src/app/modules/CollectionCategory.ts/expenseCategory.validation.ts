import { z } from 'zod';

// Create CollectionCategory zod schema
const CreateCollectionCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is hello`` required',
    }),
  }),
});

// Update CollectionCategory zod schema
const UpdateCollectionCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

// Export CollectionCategory validation schemas
export const CollectionCategoryValidation = {
  CreateCollectionCategoryZodSchema,
  UpdateCollectionCategoryZodSchema,
};
