import { z } from 'zod';
import { emailSchema } from './auth.schema';

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  emailAddress: emailSchema,
  paymentMethod: z.enum(['payos']),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
