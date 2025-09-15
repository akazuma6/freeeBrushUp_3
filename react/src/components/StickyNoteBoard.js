import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Paper, Box, TextField, Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const Note = ({ note, onUpdate, onDelete }) => {
  const [memo, setMemo] = useState(note.memo);
  const nodeRef = useRef(null);

  const handleStop = (e, data) => {
    onUpdate(note.id, { position_x: data.x, position_y: data.y });
  };

  const handleMemoBlur = () => {
    if (memo !== note.memo) {
        onUpdate(note.id, { memo });
    }
  };

  const handleColorChange = (color) => {
    onUpdate(note.id, { color });
  };

  // Red, Green, Blue palette
  const colorPalette = ['#ef9a9a', '#a5d6a7', '#90caf9'];

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      defaultPosition={{ x: note.position_x, y: note.position_y }}
      onStop={handleStop}
    >
      <Paper 
        ref={nodeRef}
        elevation={3}
        sx={{ 
          position: 'absolute', 
          width: 200, 
          height: 200, 
          backgroundColor: note.color,
          p: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box className="handle" sx={{ cursor: 'move', height: '20px', width: '100%', position: 'relative' }}>
            <IconButton onClick={() => onDelete(note.id)} size="small" sx={{position: 'absolute', top: -5, right: -5}}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
        <TextField
          multiline
          rows={5}
          variant="standard"
          fullWidth
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          onBlur={handleMemoBlur}
          InputProps={{ disableUnderline: true }}
        />
        <Box sx={{display: 'flex', justifyContent: 'space-around', mt: 1}}>
            {colorPalette.map(color => (
                <Box key={color} sx={{width: 24, height: 24, backgroundColor: color, borderRadius: '50%', cursor: 'pointer', border: '1px solid #ccc'}} onClick={() => handleColorChange(color)} />
            ))}
        </Box>
      </Paper>
    </Draggable>
  );
};

const StickyNoteBoard = ({ onOpenTasksClick, onCloseTasksClick }) => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/notes/');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo: 'New Note' }),
      });
      const newNote = await response.json();
      setNotes([...notes, newNote]);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleUpdateNote = async (id, patchData) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
      });
      // Optimistically update the color, or refetch for position/memo
      if (patchData.color) {
          setNotes(notes.map(n => n.id === id ? {...n, ...patchData} : n));
      }
    } catch (error) {
      console.error(`Failed to update note ${id}:`, error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method: 'DELETE',
      });
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error(`Failed to delete note ${id}:`, error);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '30%', height: 'auto', border: '2px solid #ddd', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddNote} sx={{ mb: 0.5 }}>
          Add Note
        </Button>
        <Button size="small" onClick={onOpenTasksClick} sx={{ mb: 1 }}>
          OPEN作業
        </Button>
        <Button size="small" onClick={onCloseTasksClick} sx={{ mb: 1 }}>
          CLOSE作業
        </Button>
      </Box>
      {notes.map(note => (
        <Note key={note.id} note={note} onUpdate={handleUpdateNote} onDelete={handleDeleteNote} />
      ))}
    </Box>
  );
};

export default StickyNoteBoard;