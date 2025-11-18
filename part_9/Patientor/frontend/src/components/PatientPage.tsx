import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from '../services/patients';
import { Patient } from '../types'

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      const data = await patientService.getById(id);
      setPatient(data);
    };

    fetchPatient();
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <h2>{patient.name}</h2>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>SSN:</strong> {patient.ssn}</p>
      <p><strong>Date of birth:</strong> {patient.dateOfBirth}</p>
      <p><strong>Occupation:</strong> {patient.occupation}</p>

      <h3>Entries</h3>
      {patient.entries.length === 0 && <p>No entries.</p>}
    </div>
  );
};

export default PatientPage;