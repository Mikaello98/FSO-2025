import React from "react";
import AddEntryForm from "./AddEntryForm";

interface Props {
  modalOpen: boolean;
  onSubmit: (values: any) => void;
  onClose: () => void;
  error?: string;
}

const EntryFormModal: React.FC<Props> = ({ modalOpen, onSubmit, onClose, error }) => {
  if (!modalOpen) return null;

  return (
    <div>
      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
};

export default EntryFormModal;