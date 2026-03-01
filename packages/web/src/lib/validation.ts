import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address').transform(val => val.toLowerCase().trim()).optional().or(z.literal('')),
    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code')
        .transform(val => val.replace(/\s/g, ''))
        .optional()
        .or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
}).refine((data) => data.email || data.phone, {
    message: 'Either email or phone must be provided',
    path: ['email'],
});

// Fixed registerFormSchema
export const registerFormSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .email('Please enter a valid email address')
        .max(255, 'Email must be less than 255 characters')
        .transform(val => val.toLowerCase().trim()),
    phone: z.string()
        .regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number')
        .max(20, 'Phone number must be less than 20 characters')
        .transform(val => val.replace(/\s/g, ''))
        .optional()
        .or(z.literal('')),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['ATTENDEE', 'ORGANIZER', 'VENDOR', 'GATE_OPERATOR']),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions'
    }),
    company: z.string()
        .max(200, 'Company name must be less than 200 characters')
        .optional()
}).refine((data) => data.email || data.phone, {
    message: 'Either email or phone must be provided',
    path: ['email'],
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Schema for API submission (excludes confirmPassword)
export const registerApiSchema = registerFormSchema.omit({ confirmPassword: true });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;