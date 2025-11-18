import { v4 as uuidv4 } from 'uuid';
import patientsData from '../data/patients';
import { NonSensitivePatient, NewPatient, Gender, Patient } from '../types';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patientsData.find(p => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuidv4(),
    ...patient
  };
  patientsData.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatient
};
