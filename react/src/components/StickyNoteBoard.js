import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import axios from 'axios';
import { Paper, Box, TextField, Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';

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
                <Box key={color} key={color} sx={{width: 24, height: 24, backgroundColor: color, borderRadius: '50%', cursor: 'pointer', border: '1px solid #ccc'}} onClick={() => handleColorChange(color)} />
            ))}
        </Box>
      </Paper>
    </Draggable>
  );
};

const StickyNoteBoard = ({ onOpenTasksClick, onCloseTasksClick }) => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/`);
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const apiRequest = async (method, url, data, successCallback) => {
      try {
          const response = await axios({ method, url, data });
          successCallback(response.data);
      } catch (error) {
          console.error(`API request failed:`, error);
      }
  }

  const handleAddNote = () => {
    apiRequest('post', `${API_BASE_URL}/notes/`, { memo: '' }, (newNote) => {
        setNotes(prevNotes => [...prevNotes, newNote]);
    });
  };

  const handleUpdateNote = (id, patchData) => {
    apiRequest('patch', `${API_BASE_URL}/notes/${id}/`, patchData, () => {
        if (patchData.color) {
            setNotes(notes.map(n => n.id === id ? {...n, ...patchData} : n));
        }
    });
  };

  const handleDeleteNote = (id) => {
    apiRequest('delete', `${API_BASE_URL}/notes/${id}/`, null, () => {
        setNotes(notes.filter(note => note.id !== id));
    });
  };

  return (
    <Box sx={{ position: 'relative', width: '30%', height: 'auto', border: '2px solid #ddd', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAddNote} sx={{ mb: 0.5 }}>
          付箋
        </Button>
        <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={onOpenTasksClick} sx={{ mb: 1 }}>
          オープン作業
        </Button>
        <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={onCloseTasksClick} sx={{ mb: 1 }}>
          クローズ作業
        </Button>
      </Box>
      {notes.map(note => (
        <Note key={note.id} note={note} onUpdate={handleUpdateNote} onDelete={handleDeleteNote} />
      ))}
    </Box>
  );
};

export default StickyNoteBoard;