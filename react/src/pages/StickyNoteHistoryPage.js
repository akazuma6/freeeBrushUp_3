import React from 'react';
import { Box, Typography } from '@mui/material';
import StickyNoteHistory from '../components/StickyNoteHistory';

export default function StickyNoteHistoryPage() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>付箋の履歴</Typography>
      <StickyNoteHistory />
    </Box>
  );
}
