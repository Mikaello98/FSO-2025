import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import patientService from '../services/patients';
import diagnosesService from '../services/diagnoses';

import { Patient, Diagnosis, NewEntry } from '../types';

import EntryFormModal from "./EntryFormModal";

import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

const healthRatingColor = (rating: number) => {
  switch (rating) {
    case 0: return "red";
    case 1: return "orange";
    case 2: return "gold";
    case 3: return "green";     
    default: return "grey";
  }
};

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string>();

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (entry: NewEntry) => {
    if (!patient) return;

    try {
      const updatedEntry = await patientService.addEntry(patient.id, entry);

      setPatient(prev =>
        prev ? ({ ...prev, entries: [...prev.entries, updatedEntry] } as Patient) : prev
      );

      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data?.error) {
        setError(JSON.stringify(e.response.data.error));
      } else {
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const p = await patientService.getById(id);
      setPatient(p);

      const d = await diagnosesService.getAll();
      setDiagnoses(d);
    };

    load();
  }, [id]);

  if (!patient) return <CircularProgress />;

  return (
    <Box>
      <EntryFormModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        onClose={closeModal}
        error={error}
        diagnoses={diagnoses}
      />

      <Typography variant="h4">{patient.name}</Typography>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>SSN:</strong> {patient.ssn}</p>
      <p><strong>Date of birth:</strong> {patient.dateOfBirth}</p>
      <p><strong>Occupation:</strong> {patient.occupation}</p>

      <Typography variant="h5" sx={{ mt: 2 }}>Entries</Typography>
      {patient.entries?.map(entry => (
        <Box key={entry.id} sx={{ border: "1px solid #ccc", p: 2, mt: 1 }}>
          <strong>{entry.date}</strong> — {entry.type}
          <p>{entry.description}</p>
          <p><em>Diagnosed by {entry.specialist}</em></p>

          {entry.diagnosisCodes?.map(code => {
            const diag = diagnoses.find(d => d.code === code);
            return (
              <li key={code}>{code} {diag ? `- ${diag.name}` : ""}</li>
            );
          })}

          {entry.type === "Hospital" && (
            <p><strong>Discharge:</strong> {entry.discharge.date} — {entry.discharge.criteria}</p>
          )}

          {entry.type === "OccupationalHealthcare" && (
            <>
              <p><strong>Employer:</strong> {entry.employerName}</p>
              {entry.sickLeave && (
                <p>Sick leave: {entry.sickLeave.startDate} → {entry.sickLeave.endDate}</p>
              )}
            </>
          )}

          {entry.type === "HealthCheck" && (
            <Box display='flex' alignItems='center' mb={1}>
              <strong>Health Rating: </strong>
              <Box ml={1} display='flex'>
                {[0, 1, 2, 3].map(i => (
                  <FavoriteIcon
                    key={i}
                    fontSize="small"
                    sx={{ color: i <= entry.healthCheckRating ? healthRatingColor(entry.healthCheckRating) : 'lightgrey', mr: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      ))}

      <Button sx={{ mt: 2 }} variant="contained" onClick={openModal}>Add Entry</Button>
    </Box>
  );
};

export default PatientPage;
