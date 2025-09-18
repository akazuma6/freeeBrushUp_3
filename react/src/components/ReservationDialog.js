import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

function ReservationDialog({ open, onClose, onSave, reservation }) {
  const [name, setName] = useState(reservation ? reservation.name : '');
  const [numberOfPeople, setNumberOfPeople] = useState(reservation ? reservation.numberOfPeople : '');

  const handleSave = () => {
    onSave({ name, numberOfPeople });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{reservation ? '予約編集' : '新規予約'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="予約者名"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="人数"
          type="number"
          fullWidth
          variant="standard"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSave}>保存</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReservationDialog;
