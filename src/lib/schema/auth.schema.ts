import { z } from 'zod';

export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .refine(
    (email) => {
      const disposableDomains = [
        '10minutemail.com',
        'temp-mail.org',
        'guerrillamail.com',
        'mailinator.com',
        'throwaway.email',
        'yopmail.com',
        'tempail.com'
      ];
      const domain = email.split('@')[1]?.toLowerCase();
      return !disposableDomains.includes(domain);
    },
    'Disposable email addresses are not allowed'
  );


export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
  );


export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name must be less than 100 characters long')
  .regex(
    /^[\p{L}\p{M}\d][\p{L}\p{M}\d\s''.\\-]*$/u,
    'Name can only contain letters, numbers, spaces, hyphens, apostrophes, and dots'
  )
  .refine(
    (name) => name.trim() === name,
    'Name cannot have leading or trailing whitespace'
  );


export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});


export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
