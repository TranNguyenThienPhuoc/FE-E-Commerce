import { z } from 'zod';
import { emailSchema } from './auth.schema';

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  companyName: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  townCity: z.string().min(1, 'Town/City is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  emailAddress: emailSchema,
  paymentMethod: z.enum(['bank_transfer', 'cod']),
  saveInfo: z.boolean().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
