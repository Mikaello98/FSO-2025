import { NewPatientSchema } from '../schemas/patientSchema';
import { NewPatient } from '../types';

export const toNewPatient = (object: unknown): NewPatient => {

  const parsed = NewPatientSchema.parse(object);

  return parsed as unknown as NewPatient;
};
