import { useState } from "react";
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Grid, OutlinedInput, Checkbox, ListItemText, Alert } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { NewEntry, HealthCheckRating, Diagnosis } from "../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  diagnoses?: Diagnosis[];
}

const healthRatingColor = (rating: number) => {
  switch (rating) {
    case 0: return "red";
    case 1: return "orange";
    case 2: return "gold";
    case 3: return "green";     
    default: return "grey";
  }
};


const AddEntryForm = ({ onSubmit, onCancel, diagnoses }: Props) => {
  const [type, setType] = useState<NewEntry['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');

  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(0);

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [sickStart, setSickStart] = useState('');
  const [sickEnd, setSickEnd] = useState('');

  const [localError, setLocalError] = useState<string | undefined>();

  const handleSubmit = () => {
    const isoDateRegex= /^\d{4}-\d{2}-\d{2}$/;

    if (!description.trim()) {
      setLocalError('Description is required');
      return;
    }
    if (!date) {
      setLocalError('Date is required');
      return;
    }
    if (!isoDateRegex.test(date)) {
      setLocalError("Date must be in format YYYY-MM-DD");
      return;
    }
    if (!specialist.trim()) {
      setLocalError('Specialist is required');
      return;
    }
    if (type === 'Hospital') {
      if (!dischargeDate || !dischargeCriteria) {
        setLocalError('Discharge date and criteria are required for Hospital entries');
      }
    }
    if (type === 'OccupationalHealthcare') {
      if (!employerName.trim()) {
        setLocalError('Employer name is required for Occupational Healthcare entries');
      }
    }

    setLocalError(undefined);

    let entry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        entry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          healthCheckRating: healthCheckRating as HealthCheckRating
        } as NewEntry;
        break;

      case 'Hospital':
        entry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        } as NewEntry;
        break;

      case 'OccupationalHealthcare':
        entry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          ...(sickStart && sickEnd
            ? { sickLeave: { startDate: sickStart, endDate: sickEnd } }
            : {})     
        } as NewEntry;
        break;
    }
    onSubmit(entry);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500 }}>
      {localError && <Alert severity="error" sx={{ mb: 1 }}>{localError}</Alert>}
      <Typography variant='h6' mb={2}>
        Add New Entry
      </Typography>

      <FormControl fullWidth margin='dense'>
        <InputLabel>Type</InputLabel>
        <Select
          value={type}
          label='Type'
          onChange={(e) => setType(e.target.value as NewEntry['type'])}
        >
          <MenuItem value='HealthCheck'>Health Check</MenuItem>
          <MenuItem value='Hospital'>Hospital</MenuItem>
          <MenuItem value='OccupationalHealthcare'>Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label='Description'
        margin='dense'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        fullWidth
        type="date"
        label='Date'
        margin="dense"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <TextField
        fullWidth
        label='Specialist'
        margin="dense"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select
          multiple
          input={<OutlinedInput label='Diagnosis Codes' />}
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
          renderValue={(selected) => selected.join(', ')}
        >
          {diagnoses?.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              <Checkbox checked={diagnosisCodes.includes(d.code)} />
              <ListItemText primary={`${d.code} - ${d.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {type === 'HealthCheck' && (
        <Box mt={2}>
          <Typography>Health Check Rating</Typography>
          <Box display="flex" alignItems="center">
            {[0, 1, 2, 3].map(i => (
              <Box
                key={i}
                onClick={() => setHealthCheckRating(i)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  mr: 1
                }}
              >
                {i <= healthCheckRating ? (
                  <FavoriteIcon sx={{ color: healthRatingColor(healthCheckRating) }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "lightgrey" }} />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {type === 'Hospital' && (
        <Box>
          <TextField
            fullWidth
            type="date"
            label='Discharge Date'
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
          />
          <TextField
            fullWidth
            label='Discharge Criteria'
            margin="dense"
            value={dischargeCriteria}
            onChange={(e) => setDischargeCriteria(e.target.value)}
          />
        </Box>
      )}

      {type === 'OccupationalHealthcare' && (
        <Box>
          <TextField
            fullWidth
            label='Employer Name'
            margin="dense"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
          />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                type="date"
                label='Sick Leave Start'
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={sickStart}
                onChange={(e) => setSickStart(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                label='Sick Leave End'
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={sickEnd}
                onChange={(e) => setSickEnd(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Box mt={2}>
        <Button variant='contained' onClick={handleSubmit} sx={{ mr: 1 }}>
          Add
        </Button>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm