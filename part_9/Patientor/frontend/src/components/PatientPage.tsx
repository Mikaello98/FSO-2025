import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from '../services/patients';
import diagnosesService from '../services/diagnoses'
import { Patient, Diagnosis, NewEntry as NewEntryType } from '../types'

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');

  const submitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    const newEntry: NewEntryType = {
      type: 'HealthCheck',
      description,
      date,
      specialist,
      healthCheckRating: 0
    };

    const updatedPatient = await patientService.addEntry(patient.id, newEntry);
    setPatient(updatedPatient);

    setDescription('');
    setDate('');
    setSpecialist('');
  };

  useEffect(() => {
    const fetchData= async () => {
      if (!id) return;
      const patientData = await patientService.getById(id);
      setPatient(patientData);

      const diagnosesData = await diagnosesService.getAll();
      setDiagnoses(diagnosesData);
    };

    void fetchData();
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
      {patient.entries.map(entry => (
        <div key={entry.id}>
          <p><strong>{entry.date}</strong> ({entry.type})</p>
          <p>{entry.description}</p>
          <p><strong>Specialist:</strong> {entry.specialist}</p>
          
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <ul>
              {entry.diagnosisCodes.map(code => {
                const diag = diagnoses.find(d => d.code === code);
                return ( 
                  <li key={code}>
                    {code} {diag ? `- ${diag.name}` : ''}
                  </li>
                );
              })}
            </ul>
          )}

          {entry.type === 'Hospital' && entry.discharge && (
            <p><strong>Discharge:</strong> {entry.discharge.date} - {entry.discharge.criteria}</p>
          )}

          {entry.type === 'OccupationalHealthcare' && (
            <>
              <p><strong>Employer:</strong> {entry.employerName}</p>
              {entry.sickLeave && (
                <p><strong>Sick Leave:</strong> {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
              )}
            </>
          )}

          {entry.type === 'HealthCheck' && (
            <p><strong>Health Rating:</strong> {entry.healthCheckRating}</p>
          )}
        </div>
      ))}

      <h3>Add New Entry</h3>
      <form onSubmit={submitEntry}>
        <div>
          Description:
          <input
            value={description}
            onChange={e => setDescription(e.target.value)} 
          />
        </div>

        <div>
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)} 
          />
        </div>

        <div>
          Specialist:
          <input
            value={specialist}
            onChange={e => setSpecialist(e.target.value)} 
          />
        </div>

        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default PatientPage;