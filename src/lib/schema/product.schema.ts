import * as z from 'zod'

export const productStatusEnum = z.enum([
  'active',
  'inactive',
  'out_of_stock',
  'pending',
  'rejected',
  'archived',
  'draft'
]);

/**
 * Schema for product forms, matching the server-side CreateProductRequestSchema.
 * Defaults and optional flags on required fields are removed to ensure type 
 * compatibility with react-hook-form resolver. 
 * Default values are handled in the useForm hook.
 */
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters'),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  price: z.number()
    .positive('Price must be a positive number'),
  stock: z.number()
    .int()
    .min(0, 'Stock cannot be negative'),
  images: z.array(z.string().url('Invalid image URL')),
  category: z.string()
    .max(100, 'Category must be less than 100 characters')
    .optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
export type ProductStatus = z.infer<typeof productStatusEnum>