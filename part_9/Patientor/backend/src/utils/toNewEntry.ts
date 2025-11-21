import { NewEntry } from '../types'
import { z } from 'zod';

export const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.number().min(0).max(3)
});

export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string()
  })
});

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date()
    })
    .optional()
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);

const toNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};

export default toNewEntry