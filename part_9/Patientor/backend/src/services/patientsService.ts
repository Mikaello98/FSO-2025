import { v1 as uuid } from 'uuid';
import patients from '../data/patients';
import { NonSensitivePatient, NewPatient, Patient, Entry } from '../types';

const getPatients = (): Patient[] => {
  return patients;
}

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Patient => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const newEntry: Entry = {
  id: uuid(),
  ...entry
};

patient.entries.push(newEntry);
return patient;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry
};
