import { v1 as uuid } from 'uuid';
import patients from '../data/patients';
import { NonSensitivePatient, NewPatient, Patient, Entry, NewEntry } from '../types';

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
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...patient
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) throw new Error('Patient not found');

  let newEntry: Entry;

  switch (entry.type) {
    case "HealthCheck":
      newEntry = {
        ...entry,
        id: uuid(),
      };
      break;

    case "Hospital":
      newEntry = {
        ...entry,
        id: uuid(),
      };
      break;

    case "OccupationalHealthcare":
      newEntry = {
        ...entry,
        id: uuid(),
      };
      break;

    default:
      throw new Error("Unhandled entry type");
  }

  patient.entries.push(newEntry);
  return newEntry;
};


export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry
};
