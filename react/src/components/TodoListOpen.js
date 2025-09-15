import React, { useState, useEffect } from 'react';
import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';

const initialTasks = {
  'トイレ清掃': false,
  'ガスの補充': false,
  'フロア清掃': false,
  '肉の仕込み': false,
  '音楽の再生': false,
};

const TODO_LIST_STORAGE_KEY = 'todo-list-state';

const TodoListOpen = ({ onComplete }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem(TODO_LIST_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : initialTasks;
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      return initialTasks;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TODO_LIST_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }

    const allComplete = Object.values(tasks).every(Boolean);
    if (allComplete) {
        // Reset tasks for the next day
        localStorage.removeItem(TODO_LIST_STORAGE_KEY);
        onComplete();
    }
  }, [tasks, onComplete]);

  const handleTaskChange = (taskName) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskName]: !prevTasks[taskName],
    }));
  };

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
                onChange={() => handleTaskChange(taskName)} 
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
