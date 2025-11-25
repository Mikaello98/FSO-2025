import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';
import AddEntryForm from "./AddEntryForm";
import { NewEntry, Diagnosis } from "../types";

interface Props {
  modalOpen: boolean;
  onSubmit: (values: NewEntry) => void;
  onClose: () => void;
  error?: string;
  diagnoses: Diagnosis[];
}

const EntryFormModal = ({ modalOpen, onSubmit, onClose, error, diagnoses }: Props) => (
  <Dialog fullWidth open={modalOpen} onClose={onClose}>
    <DialogTitle>Add New Entry</DialogTitle>
    <Divider />

    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}

      <AddEntryForm
        onSubmit={onSubmit}
        onCancel={onClose}
        diagnoses={diagnoses}
      />
    </DialogContent>
  </Dialog>
);

export default EntryFormModal;
