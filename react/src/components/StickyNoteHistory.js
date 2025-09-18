import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Box, List, ListItem, ListItemText, Paper, Typography, Chip, Button, IconButton } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';

export default function StickyNoteHistory() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/history/`);
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleRestore = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${noteId}/restore/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // 履歴リストから復元したノートを削除
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        console.error("Failed to restore note");
      }
    } catch (error) {
      console.error("Error restoring note:", error);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>付箋履歴</Typography>
      <List>
        {notes.length > 0 ? (
          notes.map(note => (
            <ListItem key={note.id} divider>
              <ListItemText primary={note.memo} />
              <Chip 
                label="■"
                size="small"
                sx={{ backgroundColor: note.color, color: note.color, mr: 1, border: '1px solid #ccc' }}
              />
              <IconButton edge="end" aria-label="restore" onClick={() => handleRestore(note.id)}>
                <RestoreIcon />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <Typography>履歴はありません。</Typography>
        )}
      </List>
    </Paper>
  );
}