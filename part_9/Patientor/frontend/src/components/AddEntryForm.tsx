import React, { useState } from "react";
import { NewEntry } from "../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState<NewEntry['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(0);

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [sickStart, setSickStart] = useState('');
  const [sickEnd, setSickEnd] = useState('');

  const submit = () => {
    let entry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        entry = {
          type,
          description,
          date,
          specialist,
          healthCheckRating
        };
        break;

      case 'Hospital':
        entry = {
          type,
          description,
          date,
          specialist,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        break;

      case 'OccupationalHealthcare':
        entry = {
          type,
          description,
          date,
          specialist,
          employerName,
          ...(sickStart && sickEnd
            ? { sickLeave: { startDate: sickStart, endDate: sickEnd } }
            : {})
          
        };
        break;
    }

    onSubmit(entry);
  };

  return (
    <div>
      <h3>Add New Entry</h3>

      <label>Type</label>
      <select value={type} onChange={(e) => setType(e.target.value as NewEntry['type'])}>
        <option value='HealthCheck'>HealthCheck</option>
        <option value='Hospital'>Hospital</option>
        <option value='OccupationalHealthcare'>OccupationalHealthcare</option>
      </select>

      <div>
        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label>Date</label>
        <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <label>Specialist</label>
        <input value={specialist} onChange={(e) => setSpecialist(e.target.value)} />
      </div>

      {type === 'HealthCheck' && (
        <div>
          <label>Health Rating (0-3)</label>
          <input 
            type='number'
            min='0'
            max='3'
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(Number(e.target.value))} 
          />
        </div>
      )}

      {type === 'Hospital' && (
        <>
          <label>Discharge Date</label>
          <input type='date' value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} />

          <label>Discharge Criteria</label>
          <input value={dischargeCriteria} onChange={(e) => setDischargeCriteria(e.target.value)} />
        </>
      )}

      {type === 'OccupationalHealthcare' && (
        <>
          <label>Employer</label>
          <input value={employerName} onChange={(e) => setEmployerName(e.target.value)} />

          <label>Sick Leave Start</label>
          <input type='date' value={sickStart} onChange={(e) => setSickStart(e.target.value)} />

          <label>Sick Leave End</label>
          <input type="date" value={sickEnd} onChange={(e) => setSickEnd(e.target.value)} />
        </>
      )}

      <button type="button" onClick={submit}>Add</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default AddEntryForm