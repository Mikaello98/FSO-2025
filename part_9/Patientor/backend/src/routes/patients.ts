import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getNonSensitivePatients();
  res.json(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientsService.getPatient(req.params.id);

  if (!patient) {
    return res.status(404).send({ error: 'Patient not found' });
  }

  return res.json(patient);
})

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

export default router;