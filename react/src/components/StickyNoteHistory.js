import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography, Chip } from '@mui/material';

export default function StickyNoteHistory() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/notes/history/');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchNotes();
  }, []);

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
            </ListItem>
          ))
        ) : (
          <Typography>履歴はありません。</Typography>
        )}
      </List>
    </Paper>
  );
}