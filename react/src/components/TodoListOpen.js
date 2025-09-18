import React from 'react';
import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';

const TodoListOpen = ({ tasks, onTaskChange }) => {
  return (
    <Paper sx={{ p: 2, width: '100%', height: 'auto' }} elevation={2}>
      <Typography variant="h6" gutterBottom>オープン作業</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {Object.keys(tasks).map(taskName => (
          <FormControlLabel
            key={taskName}
            control={
              <Checkbox 
                checked={tasks[taskName]} 
                onChange={() => onTaskChange(taskName)} 
              />
            }
            label={taskName}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TodoListOpen;