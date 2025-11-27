import express from 'express';
import { z } from 'zod';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utils/utils';
import toNewEntry from '../utils/toNewEntry';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getNonSensitivePatients();
  res.json(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientsService.getPatient(req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json(patient);
})

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    return res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error instanceof Error) {
      return res.status(400).send({ error: error.message });
    }
    return res.status(400).json({ error: 'Unknown error'})
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const patientId = req.params.id;
    const newEntry = patientsService.addEntry(patientId, toNewEntry(req.body));
    res.json(newEntry);
  } catch (e) {
    let errorMessage = 'Something went wrong';
    if (e instanceof Error) errorMessage += ' Error: ' + e.message;
    res.status(400).send(errorMessage);
  }
});

export default router;