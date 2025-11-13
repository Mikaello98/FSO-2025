import { z } from 'zod';

export const GenderEnum = z.enum(['male', 'female', 'other']);

export const NewPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format' }),
  ssn: z.string().min(1, 'SSN is required'),
  gender: GenderEnum,
  occupation: z.string().min(1, 'Occupation is required'),
});

export type NewPatientInput = z.infer<typeof NewPatientSchema>;
export type GenderType = z.infer<typeof GenderEnum>;
